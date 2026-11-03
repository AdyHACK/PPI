"""
Database Connection & Session Management
Environment-based configuration:
- Local Development: High-performance SQLite database (interactomex.db).
- Production / Staging: Seamlessly switches to PostgreSQL by setting DATABASE_URL in .env.
- Fully compatible with Alembic migrations and SQLAlchemy 2.0 ORM models.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.pool import NullPool
from backend.app.core.config import settings

DATABASE_URL = settings.DATABASE_SYNC_URL or settings.DATABASE_URL
# Ensure standard dialect for sqlite if needed
if DATABASE_URL.startswith("sqlite+aiosqlite"):
    DATABASE_URL = DATABASE_URL.replace("sqlite+aiosqlite", "sqlite")
elif DATABASE_URL.startswith("postgresql+asyncpg"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg", "postgresql")

IS_SQLITE = DATABASE_URL.startswith("sqlite")

# Configure SQLAlchemy Engine
if IS_SQLITE:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        poolclass=NullPool,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# Declarative Base for all models
Base = declarative_base()

# FastAPI Dependency for Database Sessions
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
