"""
API v1 Router Aggregator
"""

from fastapi import APIRouter
from backend.app.api.v1.endpoints import health, system_info, proteins, datasets, predict, history

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(system_info.router, tags=["System Info"])
api_router.include_router(proteins.router, prefix="/proteins", tags=["Proteins"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
api_router.include_router(predict.router, prefix="/predict", tags=["Prediction"])
api_router.include_router(history.router, prefix="/history", tags=["History"])
