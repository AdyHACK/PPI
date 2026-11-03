"""
System, Hardware & Health Check Schemas
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel

class HealthCheckResponse(BaseModel):
    status: str
    message: str
    version: str
    database: str
    device: str
    cuda_available: bool
    gpu_name: Optional[str] = None
    vram_total_mb: Optional[int] = None
    vram_free_mb: Optional[int] = None

class SystemInfoResponse(BaseModel):
    project_name: str
    version: str
    environment: str
    hardware_profile: Dict[str, Any]
    reproducibility: Dict[str, Any]
    storage_directories: Dict[str, str]
    baselines_supported: list[str]
    split_strategies: list[str]
