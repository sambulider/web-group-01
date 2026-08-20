"""
Pydantic schemas for request/response validation.
User-related schemas for authentication, registration, and profile management.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models import UserRole


# ============================================================================
# Authentication Schemas
# ============================================================================

class UserRegister(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)
    name: str = Field(..., min_length=2, max_length=255)
    role: UserRole = UserRole.STUDENT
    phone: Optional[str] = None
    institution: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str


# ============================================================================
# User Profile Schemas
# ============================================================================

class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = None
    institution: Optional[str] = None
    avatar_url: Optional[str] = None


class UserProfile(BaseModel):
    """Schema for user profile response."""
    id: str
    email: str
    name: str
    role: UserRole
    member_id: Optional[str] = None
    phone: Optional[str] = None
    institution: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProfilePublic(BaseModel):
    """Schema for public user profile."""
    id: str
    name: str
    role: UserRole
    avatar_url: Optional[str] = None
    institution: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================================================
# Admin User Management Schemas
# ============================================================================

class UserCreate(BaseModel):
    """Schema for admin creating a user."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)
    name: str = Field(..., min_length=2, max_length=255)
    role: UserRole
    phone: Optional[str] = None
    institution: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for admin updating a user."""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    role: Optional[UserRole] = None
    phone: Optional[str] = None
    institution: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class UserList(BaseModel):
    """Schema for user list item."""
    id: str
    email: str
    name: str
    role: UserRole
    member_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Pagination Schemas
# ============================================================================

class PaginatedResponse(BaseModel):
    """Generic paginated response schema."""
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


# ============================================================================
# Error Response Schemas
# ============================================================================

class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime


class ValidationError(BaseModel):
    """Schema for validation errors."""
    field: str
    message: str
    error_code: str = "validation_error"
