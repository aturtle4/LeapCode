from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None


class UserCreate(UserBase):
    password: str
    is_teacher: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshToken(BaseModel):
    refresh_token: str


class TokenData(BaseModel):
    sub: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_oauth_account: bool
    oauth_provider: Optional[str] = None
    is_teacher: bool = False
    is_admin: bool = False
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
