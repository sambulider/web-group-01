"""
Pydantic schemas for programs, enrollments, and attendance.
"""

from datetime import datetime, date, time
from typing import Optional

from pydantic import BaseModel, Field

from app.models.program import (
    ProgramStatus, ProgramMode, ProgramCategory,
    EnrollmentStatus, AttendanceResult
)


# ============================================================================
# Program Schemas
# ============================================================================

class ProgramBase(BaseModel):
    """Base schema for programs."""
    title: str = Field(..., min_length=1, max_length=255)
    category: ProgramCategory
    status: ProgramStatus
    description: Optional[str] = None
    schedule: Optional[str] = None
    duration: Optional[str] = None
    seats: int = Field(..., ge=0)
    mode: ProgramMode
    facilitator_id: Optional[str] = None
    image_url: Optional[str] = None
    form_url: Optional[str] = None
    is_featured: bool = False


class ProgramCreate(ProgramBase):
    """Schema for creating a program."""
    pass


class ProgramUpdate(BaseModel):
    """Schema for updating a program."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[ProgramCategory] = None
    status: Optional[ProgramStatus] = None
    description: Optional[str] = None
    schedule: Optional[str] = None
    duration: Optional[str] = None
    seats: Optional[int] = Field(None, ge=0)
    mode: Optional[ProgramMode] = None
    facilitator_id: Optional[str] = None
    image_url: Optional[str] = None
    form_url: Optional[str] = None
    is_featured: Optional[bool] = None


class Program(ProgramBase):
    """Schema for program response."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProgramDetail(Program):
    """Detailed program schema with enrollment info."""
    seats_available: int = Field(default=0)
    enrollments_count: int = Field(default=0)
    attendance_records_count: int = Field(default=0)


# ============================================================================
# Enrollment Schemas
# ============================================================================

class EnrollmentBase(BaseModel):
    """Base schema for enrollments."""
    progress: int = Field(default=0, ge=0, le=100)
    attendance_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    sessions_attended: int = Field(default=0, ge=0)
    sessions_total: int = Field(default=0, ge=0)


class EnrollmentCreate(BaseModel):
    """Schema for creating an enrollment."""
    program_id: str


class EnrollmentUpdate(BaseModel):
    """Schema for updating an enrollment."""
    progress: Optional[int] = Field(None, ge=0, le=100)
    attendance_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    sessions_attended: Optional[int] = Field(None, ge=0)
    sessions_total: Optional[int] = Field(None, ge=0)
    status: Optional[EnrollmentStatus] = None


class Enrollment(EnrollmentBase):
    """Schema for enrollment response."""
    id: str
    user_id: str
    program_id: str
    status: EnrollmentStatus
    enrolled_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EnrollmentWithProgram(Enrollment):
    """Enrollment schema with program details."""
    program: Optional[Program] = None


# ============================================================================
# Attendance Schemas
# ============================================================================

class AttendanceScan(BaseModel):
    """Schema for QR code scan."""
    member_id: str
    program_id: Optional[str] = None
    scanner_id: Optional[str] = "ACB-DESK-01"


class AttendanceManual(BaseModel):
    """Schema for manual attendance entry."""
    user_id: str
    program_id: str
    scanner_id: Optional[str] = None


class AttendanceRecordResponse(BaseModel):
    """Schema for attendance record response."""
    id: str
    user_id: str
    program_id: str
    result: AttendanceResult
    scanned_at: datetime

    class Config:
        from_attributes = True


class AttendanceScanResult(BaseModel):
    """Schema for scan result response."""
    success: bool
    message: str
    result: AttendanceResult
    user_name: Optional[str] = None
    program_name: Optional[str] = None
    timestamp: datetime


# ============================================================================
# Attendance Report Schemas
# ============================================================================

class AttendanceStats(BaseModel):
    """Schema for attendance statistics."""
    total_scans: int
    successful: int
    duplicates: int
    not_enrolled: int
    date: date


class UserAttendance(BaseModel):
    """Schema for user attendance details."""
    user_id: str
    user_name: str
    program_id: str
    program_name: str
    sessions_attended: int
    sessions_total: int
    attendance_percentage: float
    last_attended: Optional[datetime] = None
