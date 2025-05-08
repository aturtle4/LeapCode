from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
import time
import logging
import uvicorn

from app.core.config import settings
from app.api.routes import auth, google_classroom, skill_tree, problem
from app.db.database import Base, engine
from app.middleware.rate_limiter import rate_limit_middleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="API for LeapCode learning platform",
    docs_url=None,  # Disable default docs URL
    redoc_url=None,  # Disable default redoc URL
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.middleware("http")(rate_limit_middleware)

# Mount static files directory
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Get client IP address
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0]
    else:
        client_ip = request.client.host

    logger.info(
        f"Request started: {request.method} {request.url.path} from {client_ip}"
    )

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Request completed: {request.method} {request.url.path} "
        f"status_code={response.status_code} "
        f"duration={process_time:.3f}s"
    )

    # Add timing header to response
    response.headers["X-Process-Time"] = str(process_time)

    return response


# Custom API docs
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{settings.PROJECT_NAME} - API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_favicon_url="/static/favicon.ico",
    )


# Include routers
app.include_router(
    auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"]
)
app.include_router(
    google_classroom.router,
    prefix=f"{settings.API_V1_STR}/google-classroom",
    tags=["google classroom"],
)
app.include_router(
    skill_tree.router,
    prefix=f"{settings.API_V1_STR}/skill-trees",
    tags=["skill trees"],
)
app.include_router(
    problem.router,
    prefix=f"{settings.API_V1_STR}/problems",
    tags=["problems"],
)


# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK, tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["root"])
def read_root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "version": settings.PROJECT_VERSION,
    }


if __name__ == "__main__":
    # This allows running the application directly with python app/main.py
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
