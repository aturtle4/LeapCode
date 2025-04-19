from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, google_classroom, skill_tree
from app.db.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/")
def read_root():
    return {"message": "Welcome to the LeapCode API"}
