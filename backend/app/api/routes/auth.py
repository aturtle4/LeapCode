from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import requests
import json

from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, Token, UserResponse
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Standard username/password login
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(user.id)
    # Set cookie for easier frontend handling
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=Token)
def create_user(
    response: Response,
    user_in: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new user with email and password
    """
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if user_in.username:
        username_exists = db.query(User).filter(User.username == user_in.username).first()
        if username_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create new user
    user = User(
        email=user_in.email,
        username=user_in.username or user_in.email.split('@')[0],
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        profile_picture=user_in.profile_picture,
        is_oauth_account=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create and return access token
    access_token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/google/auth")
def google_auth():
    """
    Redirect to Google OAuth login page
    """
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
    }

@router.get("/google/callback", response_model=Token)
async def google_callback(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    """
    # Get the code from the callback
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing authorization code"
        )
    
    # Exchange code for token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    token_response = requests.post(token_url, data=data)
    if not token_response.ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve Google token"
        )
    
    token_data = token_response.json()
    google_token = token_data.get("access_token")
    
    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {"Authorization": f"Bearer {google_token}"}
    userinfo_response = requests.get(userinfo_url, headers=headers)
    
    if not userinfo_response.ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve Google user info"
        )
    
    userinfo = userinfo_response.json()
    
    # Check if user exists
    user = db.query(User).filter(User.email == userinfo.get("email")).first()
    if not user:
        # Create user
        user = User(
            email=userinfo.get("email"),
            username=userinfo.get("email").split('@')[0],
            is_oauth_account=True,
            oauth_provider="google",
            oauth_id=userinfo.get("sub"),
            first_name=userinfo.get("given_name"),
            last_name=userinfo.get("family_name"),
            profile_picture=userinfo.get("picture")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.is_oauth_account:
        # Update existing email-password user with Google info
        user.is_oauth_account = True
        user.oauth_provider = "google"
        user.oauth_id = userinfo.get("sub")
        if not user.profile_picture:
            user.profile_picture = userinfo.get("picture")
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production
        samesite="lax"
    )
    
    # Redirect to frontend with token
    url = f"{settings.CORS_ORIGINS[0]}/auth/callback?token={access_token}"
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "redirect_url": url
    }

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user information
    """
    return current_user