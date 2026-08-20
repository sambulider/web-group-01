"""
SQLAlchemy ORM models package.
Exports all models for easy importing.
"""

from app.models.user import User, UserRole
from app.models.program import (
    Program,
    ProgramStatus,
    ProgramMode,
    ProgramCategory,
    Enrollment,
    EnrollmentStatus,
    AttendanceRecord,
    AttendanceResult,
)
from app.models.content import (
    Assignment,
    AssignmentStatus,
    Announcement,
    AnnouncementTag,
    Event,
    GalleryItem,
    GalleryItemType,
    Notification,
)
from app.models.settings import SystemSetting

__all__ = [
    # User
    "User",
    "UserRole",
    # Program
    "Program",
    "ProgramStatus",
    "ProgramMode",
    "ProgramCategory",
    "Enrollment",
    "EnrollmentStatus",
    "AttendanceRecord",
    "AttendanceResult",
    # Content
    "Assignment",
    "AssignmentStatus",
    "Announcement",
    "AnnouncementTag",
    "Event",
    "GalleryItem",
    "GalleryItemType",
    "Notification",
    "SystemSetting",
]
