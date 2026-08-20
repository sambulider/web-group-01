"""Initial database schema creation.

Revision ID: 001_initial
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial database schema."""
    
    # Create ENUM types
    userRole = postgresql.ENUM('student', 'volunteer', 'admin', name='userrole')
    userRole.create(op.get_bind(), checkfirst=True)
    
    programStatus = postgresql.ENUM('open', 'closed', 'upcoming', name='programstatus')
    programStatus.create(op.get_bind(), checkfirst=True)
    
    programMode = postgresql.ENUM('in_person', 'hybrid', 'online', name='programmode')
    programMode.create(op.get_bind(), checkfirst=True)
    
    programCategory = postgresql.ENUM(
        'regular', 'thematic', 'skill_development', 'leadership',
        'digital_literacy', 'entrepreneurship', 'career_development',
        name='programcategory'
    )
    programCategory.create(op.get_bind(), checkfirst=True)
    
    enrollmentStatus = postgresql.ENUM('active', 'completed', 'dropped', 'suspended', name='enrollmentstatus')
    enrollmentStatus.create(op.get_bind(), checkfirst=True)
    
    attendanceResult = postgresql.ENUM('success', 'duplicate', 'not_enrolled', name='attendanceresult')
    attendanceResult.create(op.get_bind(), checkfirst=True)
    
    assignmentStatus = postgresql.ENUM('pending', 'confirmed', 'completed', 'cancelled', name='assignmentstatus')
    assignmentStatus.create(op.get_bind(), checkfirst=True)
    
    announcementTag = postgresql.ENUM('notice', 'deadline', 'result', 'update', name='announcementtag')
    announcementTag.create(op.get_bind(), checkfirst=True)
    
    galleryItemType = postgresql.ENUM('photo', 'video', name='galleryitemtype')
    galleryItemType.create(op.get_bind(), checkfirst=True)

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('role', userRole, nullable=False, server_default='student'),
        sa.Column('member_id', sa.String(50), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('institution', sa.String(255), nullable=True),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('member_id'),
    )
    op.create_index('idx_user_active', 'users', ['is_active'])
    op.create_index('idx_user_role_active', 'users', ['role', 'is_active'])
    op.create_index('idx_user_created_at', 'users', ['created_at'])

    # Create programs table
    op.create_table(
        'programs',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('category', programCategory, nullable=False),
        sa.Column('status', programStatus, nullable=False, server_default='open'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('schedule', sa.String(255), nullable=True),
        sa.Column('duration', sa.String(100), nullable=True),
        sa.Column('seats', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('mode', programMode, nullable=False, server_default='in_person'),
        sa.Column('facilitator_id', sa.String(36), nullable=True),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('form_url', sa.String(500), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['facilitator_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_program_title', 'programs', ['title'])
    op.create_index('idx_program_status_category', 'programs', ['status', 'category'])
    op.create_index('idx_program_created_at', 'programs', ['created_at'])

    # Create enrollments table
    op.create_table(
        'enrollments',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('program_id', sa.String(36), nullable=False),
        sa.Column('status', enrollmentStatus, nullable=False, server_default='active'),
        sa.Column('progress', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('attendance_percentage', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('sessions_attended', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('sessions_total', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('enrolled_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['program_id'], ['programs.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'program_id', name='uq_enrollment_user_program'),
    )
    op.create_index('idx_enrollment_user_id', 'enrollments', ['user_id'])
    op.create_index('idx_enrollment_program_id', 'enrollments', ['program_id'])
    op.create_index('idx_enrollment_status', 'enrollments', ['status'])

    # Create attendance_records table
    op.create_table(
        'attendance_records',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('program_id', sa.String(36), nullable=False),
        sa.Column('result', attendanceResult, nullable=False),
        sa.Column('scanner_id', sa.String(50), nullable=True),
        sa.Column('scanned_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['program_id'], ['programs.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_attendance_user_program_date', 'attendance_records', ['user_id', 'program_id', 'scanned_at'])
    op.create_index('idx_attendance_date', 'attendance_records', ['scanned_at'])

    # Create assignments table
    op.create_table(
        'assignments',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('volunteer_id', sa.String(36), nullable=False),
        sa.Column('activity', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('assignment_date', sa.Date(), nullable=False),
        sa.Column('start_time', sa.Time(), nullable=False),
        sa.Column('end_time', sa.Time(), nullable=False),
        sa.Column('role', sa.String(100), nullable=False),
        sa.Column('hours', sa.Integer(), nullable=False),
        sa.Column('status', assignmentStatus, nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['volunteer_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_assignment_volunteer_date', 'assignments', ['volunteer_id', 'assignment_date'])
    op.create_index('idx_assignment_status', 'assignments', ['status'])

    # Create announcements table
    op.create_table(
        'announcements',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('tag', announcementTag, nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_announcement_title', 'announcements', ['title'])
    op.create_index('idx_announcement_published_date', 'announcements', ['is_published', 'created_at'])
    op.create_index('idx_announcement_tag', 'announcements', ['tag'])

    # Create events table
    op.create_table(
        'events',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('start_time', sa.Time(), nullable=False),
        sa.Column('end_time', sa.Time(), nullable=True),
        sa.Column('location', sa.String(255), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('registered', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_event_title', 'events', ['title'])
    op.create_index('idx_event_date_published', 'events', ['event_date', 'is_published'])
    op.create_index('idx_event_category', 'events', ['category'])

    # Create gallery_items table
    op.create_table(
        'gallery_items',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('item_type', galleryItemType, nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('image_url', sa.String(500), nullable=False),
        sa.Column('video_url', sa.String(500), nullable=True),
        sa.Column('poster_url', sa.String(500), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('taken_at', sa.Date(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_gallery_category_published', 'gallery_items', ['category', 'is_published'])
    op.create_index('idx_gallery_type', 'gallery_items', ['item_type'])

    # Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_notification_user_read', 'notifications', ['user_id', 'is_read'])
    op.create_index('idx_notification_created_at', 'notifications', ['created_at'])


def downgrade() -> None:
    """Drop all tables created during upgrade."""
    op.drop_table('notifications')
    op.drop_table('gallery_items')
    op.drop_table('events')
    op.drop_table('announcements')
    op.drop_table('assignments')
    op.drop_table('attendance_records')
    op.drop_table('enrollments')
    op.drop_table('programs')
    op.drop_table('users')
