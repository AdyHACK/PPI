"""
Base Model Classes and Common Utilities
"""

from datetime import datetime
from sqlalchemy import Column, DateTime
from backend.app.core.database import Base

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
