from datetime import datetime, timedelta
from typing import Any, Optional, Union, Dict, Tuple

import jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT access token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT refresh token with longer expiry
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(
        to_encode, settings.REFRESH_TOKEN_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str, secret_key: str) -> Dict[str, Any]:
    """
    Decode JWT token
    """
    try:
        decoded_token = jwt.decode(token, secret_key, algorithms=[settings.ALGORITHM])
        return decoded_token
    except jwt.PyJWTError:
        return None


def create_token_pair(user_id: int) -> Tuple[str, str]:
    """
    Create both access and refresh token for a user
    """
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    return access_token, refresh_token


def verify_refresh_token(refresh_token: str) -> Optional[str]:
    """
    Verify refresh token and return user_id if valid
    """
    payload = decode_token(refresh_token, settings.REFRESH_TOKEN_SECRET_KEY)
    if payload and payload.get("type") == "refresh":
        return payload.get("sub")
    return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hashed version
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password
    """
    return pwd_context.hash(password)
