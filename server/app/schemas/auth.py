import re
import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.user import Gender


class UserRegister(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100, description="User's first name")
    last_name: str = Field(..., min_length=1, max_length=100, description="User's last name")
    email: EmailStr = Field(..., description="Valid unique email address")
    date_of_birth: Optional[date] = Field(default=None, description="Date of birth (YYYY-MM-DD)")
    country: Optional[str] = Field(default=None, max_length=100, description="Country of residence")
    city: Optional[str] = Field(default=None, max_length=100, description="City of residence")
    phone_no: Optional[str] = Field(default=None, max_length=30, description="Contact phone number")
    gender: Optional[Gender] = Field(default=None, description="Gender (male, female, other, prefer_not_to_say)")
    password: str = Field(..., min_length=8, max_length=128, description="Strong account password")

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            cleaned = v.strip()
            if not cleaned:
                raise ValueError("Name cannot be empty or purely whitespace")
            return cleaned
        return v

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: Optional[date]) -> Optional[date]:
        if v is not None:
            today = date.today()
            if v > today:
                raise ValueError("Date of birth cannot be in the future")
            if (today.year - v.year) > 130:
                raise ValueError("Invalid date of birth")
        return v

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")
    password: str = Field(..., description="Account password")

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v


class UserResponse(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    date_of_birth: Optional[date] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone_no: Optional[str] = None
    gender: Optional[Gender] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    message: str = Field(..., description="Status message")
    user: UserResponse = Field(..., description="Authenticated user profile")
    access_token: Optional[str] = Field(
        default=None,
        description="JWT access token (automatically stored in HttpOnly cookie)",
    )
    refresh_token: Optional[str] = Field(
        default=None,
        description="JWT refresh token (automatically stored in HttpOnly cookie)",
    )


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="Short-lived JWT access token")
    refresh_token: str = Field(..., description="Secure rotating refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration in seconds")
    user: UserResponse = Field(..., description="Authenticated user profile")


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., description="Current password for verification")
    new_password: str = Field(..., min_length=8, max_length=128, description="New strong password")

    @field_validator("new_password")
    @classmethod
    def validate_new_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v


class GoogleAuthUrlResponse(BaseModel):
    url: str = Field(..., description="Google OAuth authorization URL generated via Neon Better Auth")


class GoogleSyncRequest(BaseModel):
    session_token: Optional[str] = Field(
        default=None,
        description="Better Auth session token from Neon (if not passed in cookie)",
    )


class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
