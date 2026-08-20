"""
Database connection and session management.
Provides SQLAlchemy engine, session factory, and base model.
"""

from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {}
if "supabase.co" in database_url:
    connect_args = {"sslmode": "require"}

engine_kwargs = {
    "pool_size": settings.DATABASE_POOL_SIZE,
    "pool_recycle": settings.DATABASE_POOL_RECYCLE,
    "pool_pre_ping": True,
    "echo": settings.DATABASE_ECHO,
}

engine = create_engine(
    database_url,
    connect_args=connect_args,
    **engine_kwargs,
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for all ORM models
Base = declarative_base()


# Event listener for connection pool
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Enable foreign key constraints for SQLite (not needed for PostgreSQL)."""
    if "sqlite" in settings.DATABASE_URL:
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    Automatically closes the session after the request is complete.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_db_async() -> Generator[Session, None, None]:
    """
    Async dependency function to get database session.
    For use with async endpoints.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
