"""
SQLAlchemy ORM models for assignments, announcements, events, and gallery.
"""

from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column, String, DateTime, Integer, Text, ForeignKey, Index, Boolean,
    Enum as SQLEnum, Date, Time, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.database import Base


# ============================================================================
# VOLUNTEER ASSIGNMENTS
# ============================================================================

class AssignmentStatus(str, Enum):
    """Volunteer assignment status."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Assignment(Base):
    """Volunteer assignment records."""
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, index=True)
    volunteer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    activity = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Schedule
    assignment_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    # Details
    role = Column(String(100), nullable=False)
    hours = Column(Integer, nullable=False)
    status = Column(SQLEnum(AssignmentStatus), nullable=False, default=AssignmentStatus.PENDING)
    
    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    volunteer = relationship("User", back_populates="assignments")

    __table_args__ = (
        Index("idx_assignment_volunteer_date", "volunteer_id", "assignment_date"),
        Index("idx_assignment_status", "status"),
    )

    def __repr__(self) -> str:
        return f"<Assignment(id={self.id}, volunteer={self.volunteer_id})>"


# ============================================================================
# ANNOUNCEMENTS
# ============================================================================

class AnnouncementTag(str, Enum):
    """Announcement tags/categories."""
    NOTICE = "notice"
    DEADLINE = "deadline"
    RESULT = "result"
    UPDATE = "update"


class Announcement(Base):
    """Announcements and news."""
    __tablename__ = "announcements"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    body = Column(Text, nullable=False)
    tag = Column(SQLEnum(AnnouncementTag), nullable=False)
    
    # Status
    is_published = Column(Boolean, default=True)
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

    __table_args__ = (
        Index("idx_announcement_published_date", "is_published", "created_at"),
        Index("idx_announcement_tag", "tag"),
    )

    def __repr__(self) -> str:
        return f"<Announcement(id={self.id}, title={self.title})>"


# ============================================================================
# EVENTS
# ============================================================================

class Event(Base):
    """Events and activities."""
    __tablename__ = "events"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    
    # Schedule
    event_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=True)
    
    # Location
    location = Column(String(255), nullable=False)
    
    # Capacity
    capacity = Column(Integer, default=0)
    registered = Column(Integer, default=0)
    
    # Status
    is_published = Column(Boolean, default=True)
    
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

    __table_args__ = (
        Index("idx_event_date_published", "event_date", "is_published"),
        Index("idx_event_category", "category"),
    )

    def __repr__(self) -> str:
        return f"<Event(id={self.id}, title={self.title})>"


# ============================================================================
# GALLERY
# ============================================================================

class GalleryItemType(str, Enum):
    """Gallery item type."""
    PHOTO = "photo"
    VIDEO = "video"


class GalleryItem(Base):
    """Gallery photos and videos."""
    __tablename__ = "gallery_items"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    item_type = Column(SQLEnum(GalleryItemType), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    
    # Media
    image_url = Column(String(500), nullable=False)
    video_url = Column(String(500), nullable=True)
    poster_url = Column(String(500), nullable=True)  # Video thumbnail
    
    # Metadata
    is_published = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    
    # Timestamps
    taken_at = Column(Date, nullable=True)
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

    __table_args__ = (
        Index("idx_gallery_category_published", "category", "is_published"),
        Index("idx_gallery_type", "item_type"),
    )

    def __repr__(self) -> str:
        return f"<GalleryItem(id={self.id}, title={self.title})>"


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class Notification(Base):
    """User notifications."""
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    
    # Status
    is_read = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index("idx_notification_user_read", "user_id", "is_read"),
        Index("idx_notification_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, user={self.user_id})>"
