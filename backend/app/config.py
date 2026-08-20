"""
Configuration management for the FastAPI application.
Handles environment variables and application settings.
"""

from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "American Corner Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DATA_MODE: Literal["dummy", "live", "hybrid"] = "hybrid"

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_POOL_RECYCLE: int = 3600
    DATABASE_ECHO: bool = False

    # Security & Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS & API
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    API_V1_PREFIX: str = "/api/v1"

    @field_validator("ALLOWED_ORIGINS", "ALLOWED_IMAGE_EXTENSIONS", "ALLOWED_VIDEO_EXTENSIONS", mode="before")
    @classmethod
    def parse_list_fields(cls, value):
        if value is None:
            return []
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []
            if text.startswith("["):
                import json
                return json.loads(text)
            return [item.strip() for item in text.split(",") if item.strip()]
        return value
    API_TITLE: str = "American Corner API"
    API_DESCRIPTION: str = "Management system for American Corner Batticaloa"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    # Email Configuration (Optional)
    SMTP_SERVER: str | None = None
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM_EMAIL: str | None = None

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_EXTENSIONS: list[str] = ["jpg", "jpeg", "png", "webp"]
    ALLOWED_VIDEO_EXTENSIONS: list[str] = ["mp4", "webm", "mov"]

    # Feature Flags
    ENABLE_REGISTRATION: bool = True
    ENABLE_EMAIL_VERIFICATION: bool = False
    ENABLE_SMS_NOTIFICATIONS: bool = False
    ENABLE_PDF_CERTIFICATES: bool = True

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Using lru_cache ensures settings are only loaded once.
    """
    return Settings()


# Export singleton instance
settings = get_settings()
