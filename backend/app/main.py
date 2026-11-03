"""
InteractomeX FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api.v1.api import api_router
from backend.app.db.seed_demo import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle handler.
    Initializes database tables and populates baseline catalog on startup.
    """
    # 1. Initialize tables & seed baseline records
    try:
        seed_database()
    except Exception as e:
        print(f"Notice: Initial seed: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal AI Platform for Protein-Protein Interaction Prediction (ESM-2 + Node2Vec + 32-MoE)",
    lifespan=lifespan
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Top-level Health check shortcut for frontend ping
@app.get("/health", tags=["Health"])
def root_health():
    """Quick top-level health probe matching frontend config endpoint."""
    return {"status": "connected", "message": "Connected to Live FastAPI Engine", "version": settings.VERSION}

@app.get("/", tags=["Root"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
