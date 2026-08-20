"""
Security utilities for authentication, authorization, and password management.
Implements JWT tokens, role-based access control (RBAC), and password hashing.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token authentication
security = HTTPBearer()


class TokenData(BaseModel):
    """JWT token payload data."""
    sub: str  # user_id
    exp: datetime
    iat: datetime
    type: str  # "access" or "refresh"
    role: str
    email: str


class TokenResponse(BaseModel):
    """Response with access and refresh tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    user_id: str,
    email: str,
    role: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create JWT access token.
    
    Args:
        user_id: User identifier
        email: User email
        role: User role (student, volunteer, admin)
        expires_delta: Token expiration time
        
    Returns:
        JWT token string
    """
    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_refresh_token(
    user_id: str,
    email: str,
    role: str,
) -> str:
    """
    Create JWT refresh token.
    
    Args:
        user_id: User identifier
        email: User email
        role: User role
        
    Returns:
        JWT token string
    """
    now = datetime.now(timezone.utc)
    expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "refresh",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def verify_token(token: str, token_type: str = "access") -> TokenData:
    """
    Verify and decode JWT token.
    
    Args:
        token: JWT token string
        token_type: Expected token type (access or refresh)
        
    Returns:
        TokenData with decoded payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        
        # Verify token type
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        
        return TokenData(**payload)
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> dict:
    """
    Dependency to get current authenticated user from token.
    
    Args:
        credentials: HTTP Bearer token
        db: Database session
        
    Returns:
        Current user data from database
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    token_data = verify_token(token, token_type="access")
    
    # Import here to avoid circular imports
    from app.models.user import User
    
    user = db.query(User).filter(User.id == token_data.sub).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
    }


async def get_current_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Dependency to ensure current user is an admin.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user data if admin
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_current_student(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Dependency to ensure current user is a student.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user data if student
        
    Raises:
        HTTPException: If user is not a student
    """
    if current_user["role"] not in ["student", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required",
        )
    return current_user


async def get_current_volunteer(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Dependency to ensure current user is a volunteer.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user data if volunteer
        
    Raises:
        HTTPException: If user is not a volunteer
    """
    if current_user["role"] not in ["volunteer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Volunteer access required",
        )
    return current_user
