# Rate limiting middleware implementation
import time
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Tuple, Optional, Set
from app.core.config import settings

logger = logging.getLogger(__name__)


# Simple in-memory store for rate limit tracking
# In production, use Redis or another distributed cache
class RateLimiter:
    def __init__(
        self,
        limit: int = settings.RATE_LIMIT_REQUESTS,
        period: int = settings.RATE_LIMIT_PERIOD_SECONDS,
    ):
        self.limit = limit
        self.period = period
        self.requests: Dict[str, Tuple[int, float]] = {}  # IP -> (count, start_time)
        self.blacklist: Set[str] = set()  # IPs that have been repeatedly abusive
        logger.info(
            f"Rate limiter initialized with {limit} requests per {period} seconds"
        )

    def is_rate_limited(self, ip: str) -> Tuple[bool, Dict]:
        """Check if the request is rate limited and return information about limits"""
        # Always block blacklisted IPs
        if ip in self.blacklist:
            logger.warning(f"Blocked request from blacklisted IP: {ip}")
            return True, {"limit": self.limit, "remaining": 0, "reset": 0}

        # Get current time
        current_time = time.time()

        # If the IP is not in the requests dict or the period has expired
        if (
            ip not in self.requests
            or (current_time - self.requests[ip][1]) > self.period
        ):
            self.requests[ip] = (1, current_time)
            return False, {
                "limit": self.limit,
                "remaining": self.limit - 1,
                "reset": int(current_time + self.period),
            }

        # Extract the request count and start time
        count, start_time = self.requests[ip]
        time_elapsed = current_time - start_time
        time_remaining = self.period - time_elapsed

        # If the period is still active and count is under limit
        if count < self.limit:
            self.requests[ip] = (count + 1, start_time)
            return False, {
                "limit": self.limit,
                "remaining": self.limit - count - 1,
                "reset": int(start_time + self.period),
            }

        # Rate limit exceeded
        logger.warning(f"Rate limit exceeded for IP: {ip}")
        return True, {
            "limit": self.limit,
            "remaining": 0,
            "reset": int(start_time + self.period),
        }

    def blacklist_ip(self, ip: str) -> None:
        """Add an IP to the blacklist for repeated abuse"""
        self.blacklist.add(ip)
        logger.warning(f"IP {ip} has been blacklisted for repeated abuse")


# Create a global rate limiter instance
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    """Middleware to implement rate limiting based on client IP"""
    # Skip rate limiting if disabled in settings
    if not settings.RATE_LIMIT_ENABLED:
        return await call_next(request)

    # Get the client IP address
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0]
    else:
        client_ip = request.client.host

    # Check if the request is rate limited
    is_limited, limit_info = rate_limiter.is_rate_limited(client_ip)

    # If rate limited, return a 429 Too Many Requests response
    if is_limited:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "detail": "Too many requests. Please try again later.",
                "limit": limit_info["limit"],
                "reset": limit_info["reset"],
            },
            headers={
                "Retry-After": str(limit_info["reset"] - int(time.time())),
                "X-RateLimit-Limit": str(limit_info["limit"]),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(limit_info["reset"]),
            },
        )

    # Process the request
    response = await call_next(request)

    # Add rate limit headers to response
    response.headers["X-RateLimit-Limit"] = str(limit_info["limit"])
    response.headers["X-RateLimit-Remaining"] = str(limit_info["remaining"])
    response.headers["X-RateLimit-Reset"] = str(limit_info["reset"])

    return response
