"""
InteractomeX Backend Configuration
Handles environment settings, reproducibility seeds, database URLs,
and hardware optimization profiles for local GPUs (RTX 3050 4GB).
"""

import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InteractomeX AI Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database URLs
    # Defaults to SQLite with aiosqlite for zero-setup local execution,
    # and seamlessly connects to PostgreSQL when DATABASE_URL is set.
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./interactomex.db",
        description="Async database connection string"
    )
    DATABASE_SYNC_URL: str = Field(
        default="sqlite:///./interactomex.db",
        description="Sync database connection string for migrations and seeding"
    )

    # Server & CORS
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    # Reproducibility & Research Protocol
    RANDOM_SEED: int = 42
    PYTORCH_SEED: int = 42
    NUMPY_SEED: int = 42

    # Hardware Profile: RTX 3050 (4GB VRAM) / 8GB RAM
    DEVICE_PREFERENCE: str = "cuda"  # Auto-falls back to cpu if cuda unavailable
    USE_FP16: bool = True            # Automatic Mixed Precision to conserve 4GB VRAM
    FREEZE_ESM: bool = True          # Freeze ESM-2 weights to prevent GPU memory overflow
    BATCH_SIZE: int = 16             # Memory-conservative batch size for downstream training
    ESM_BATCH_SIZE: int = 1          # Single-sequence ESM extraction to prevent OOM
    MAX_SEQUENCE_LENGTH: int = 1024  # Standard ESM-2 sequence limit

    # Storage Paths
    STORAGE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage"))
    EMBEDDING_CACHE_DIR: str = os.path.join(STORAGE_DIR, "embeddings")
    CHECKPOINT_DIR: str = os.path.join(STORAGE_DIR, "checkpoints")
    DATASET_DIR: str = os.path.join(STORAGE_DIR, "datasets")

    # Research Evaluation Strategies
    DEFAULT_SPLIT_STRATEGY: str = "random_stratified"  # "random_stratified" or "protein_disjoint"
    NEGATIVE_SAMPLING_LABEL: str = "putative_negative" # Explicitly marks non-interacting pairs as putative

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure critical storage directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.EMBEDDING_CACHE_DIR, exist_ok=True)
os.makedirs(settings.CHECKPOINT_DIR, exist_ok=True)
os.makedirs(settings.DATASET_DIR, exist_ok=True)
