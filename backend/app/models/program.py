"""
SQLAlchemy ORM models for programs, enrollments, and attendance.
"""

from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column, String, DateTime, Integer, Float, Boolean, Text,
    ForeignKey, Index, Enum as SQLEnum, Date, Time, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.database import Base


class ProgramStatus(str, Enum):
    """Program enrollment status."""
    OPEN = "open"
    CLOSED = "closed"
    UPCOMING = "upcoming"


class ProgramMode(str, Enum):
    """Program delivery mode."""
    IN_PERSON = "in_person"
    HYBRID = "hybrid"
    ONLINE = "online"


class ProgramCategory(str, Enum):
    """Program categories."""
    REGULAR = "regular"
    THEMATIC = "thematic"
    SKILL_DEVELOPMENT = "skill_development"
    LEADERSHIP = "leadership"
    DIGITAL_LITERACY = "digital_literacy"
    ENTREPRENEURSHIP = "entrepreneurship"
    CAREER_DEVELOPMENT = "career_development"


class Program(Base):
    """Program/Course model."""
    __tablename__ = "programs"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    category = Column(SQLEnum(ProgramCategory), nullable=False)
    status = Column(SQLEnum(ProgramStatus), nullable=False, default=ProgramStatus.OPEN)
    description = Column(Text, nullable=True)
    schedule = Column(String(255), nullable=True)
    duration = Column(String(100), nullable=True)
    seats = Column(Integer, nullable=False, default=0)
    mode = Column(SQLEnum(ProgramMode), nullable=False, default=ProgramMode.IN_PERSON)
    facilitator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    image_url = Column(String(500), nullable=True)
    form_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    
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

    # Relationships
    enrollments = relationship(
        "Enrollment",
        back_populates="program",
        cascade="all, delete-orphan",
    )
    attendance_records = relationship(
        "AttendanceRecord",
        back_populates="program",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("idx_program_status_category", "status", "category"),
        Index("idx_program_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Program(id={self.id}, title={self.title}, status={self.status})>"


class EnrollmentStatus(str, Enum):
    """Enrollment status."""
    ACTIVE = "active"
    COMPLETED = "completed"
    DROPPED = "dropped"
    SUSPENDED = "suspended"


class Enrollment(Base):
    """Student enrollment in programs."""
    __tablename__ = "enrollments"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    program_id = Column(String(36), ForeignKey("programs.id"), nullable=False, index=True)
    status = Column(SQLEnum(EnrollmentStatus), nullable=False, default=EnrollmentStatus.ACTIVE)
    
    # Progress tracking
    progress = Column(Integer, default=0)  # Percentage
    attendance_percentage = Column(Float, default=0.0)
    sessions_attended = Column(Integer, default=0)
    sessions_total = Column(Integer, default=0)
    
    # Timestamps
    enrolled_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="enrollments")
    program = relationship("Program", back_populates="enrollments")

    __table_args__ = (
        UniqueConstraint("user_id", "program_id", name="uq_enrollment_user_program"),
        Index("idx_enrollment_status", "status"),
    )

    def __repr__(self) -> str:
        return f"<Enrollment(user={self.user_id}, program={self.program_id})>"


class AttendanceResult(str, Enum):
    """Attendance scanning result."""
    SUCCESS = "success"
    DUPLICATE = "duplicate"
    NOT_ENROLLED = "not_enrolled"


class AttendanceRecord(Base):
    """Attendance scanning records."""
    __tablename__ = "attendance_records"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    program_id = Column(String(36), ForeignKey("programs.id"), nullable=False, index=True)
    result = Column(SQLEnum(AttendanceResult), nullable=False)
    
    # Scanner information
    scanner_id = Column(String(50), nullable=True)  # Front desk station ID
    scanned_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    user = relationship("User", back_populates="attendance_records")
    program = relationship("Program", back_populates="attendance_records")

    __table_args__ = (
        Index("idx_attendance_user_program_date", "user_id", "program_id", "scanned_at"),
        Index("idx_attendance_date", "scanned_at"),
    )

    def __repr__(self) -> str:
        return f"<AttendanceRecord(user={self.user_id}, result={self.result})>"
