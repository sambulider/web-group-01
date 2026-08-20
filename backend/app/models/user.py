"""
SQLAlchemy ORM models for users.
Defines User model with relationships to enrollments, assignments, etc.
"""

from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, String, DateTime, Boolean, Index, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, Enum):
    """User roles in the system."""
    STUDENT = "student"
    VOLUNTEER = "volunteer"
    ADMIN = "admin"


class User(Base):
    """User model for storing user information."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    member_id = Column(String(50), unique=True, nullable=True, index=True)
    phone = Column(String(20), nullable=True)
    institution = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    enrollments = relationship(
        "Enrollment",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    assignments = relationship(
        "Assignment",
        back_populates="volunteer",
        cascade="all, delete-orphan",
    )
    attendance_records = relationship(
        "AttendanceRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    
    # Indexes
    __table_args__ = (
        Index("idx_user_role_active", "role", "is_active"),
        Index("idx_user_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
