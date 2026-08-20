"""
Pydantic schemas package.
Exports all schemas for easy importing.
"""

from app.schemas.user import (
    UserRegister,
    UserLogin,
    TokenResponse,
    RefreshTokenRequest,
    UserProfile,
    UserProfileUpdate,
    UserProfilePublic,
    UserCreate,
    UserUpdate,
    UserList,
    PaginatedResponse,
    ErrorResponse,
    ValidationError,
)
from app.schemas.program import (
    Program,
    ProgramCreate,
    ProgramUpdate,
    ProgramDetail,
    Enrollment,
    EnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentWithProgram,
    AttendanceScan,
    AttendanceManual,
    AttendanceRecordResponse,
    AttendanceScanResult,
    AttendanceStats,
    UserAttendance,
)

__all__ = [
    # User schemas
    "UserRegister",
    "UserLogin",
    "TokenResponse",
    "RefreshTokenRequest",
    "UserProfile",
    "UserProfileUpdate",
    "UserProfilePublic",
    "UserCreate",
    "UserUpdate",
    "UserList",
    "PaginatedResponse",
    "ErrorResponse",
    "ValidationError",
    # Program schemas
    "Program",
    "ProgramCreate",
    "ProgramUpdate",
    "ProgramDetail",
    "Enrollment",
    "EnrollmentCreate",
    "EnrollmentUpdate",
    "EnrollmentWithProgram",
    # Attendance schemas
    "AttendanceScan",
    "AttendanceManual",
    "AttendanceRecordResponse",
    "AttendanceScanResult",
    "AttendanceStats",
    "UserAttendance",
]
