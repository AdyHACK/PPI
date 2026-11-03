"""
System Info & Research Specifications Endpoint
Exposes reproducibility seeds, hardware profiles, baseline configurations,
and dataset splitting protocol.
"""

from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.schemas.system import SystemInfoResponse

router = APIRouter()

@router.get("/info", response_model=SystemInfoResponse)
async def get_system_info():
    """
    Returns platform environment, hardware optimizations, and research protocol parameters.
    """
    return SystemInfoResponse(
        project_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        hardware_profile={
            "target_gpu": "NVIDIA GeForce RTX 3050 (4GB VRAM)",
            "system_ram": "8GB",
            "batch_size_training": settings.BATCH_SIZE,
            "esm_extraction_batch_size": settings.ESM_BATCH_SIZE,
            "use_fp16_mixed_precision": settings.USE_FP16,
            "freeze_esm_backbone": settings.FREEZE_ESM,
            "max_sequence_length": settings.MAX_SEQUENCE_LENGTH
        },
        reproducibility={
            "random_seed": settings.RANDOM_SEED,
            "pytorch_seed": settings.PYTORCH_SEED,
            "numpy_seed": settings.NUMPY_SEED,
            "deterministic_cuda": True,
            "provenance_tracked": True
        },
        storage_directories={
            "embedding_cache": settings.EMBEDDING_CACHE_DIR,
            "checkpoints": settings.CHECKPOINT_DIR,
            "datasets": settings.DATASET_DIR
        },
        baselines_supported=[
            "Logistic Regression",
            "Random Forest",
            "XGBoost",
            "Multi-Layer Perceptron (MLP)",
            "Transformer without MoE (Dense FFN)",
            "InteractomeX (Multimodal + 32-Sparse MoE Top-1)"
        ],
        split_strategies=[
            "random_stratified (80/10/10 partitioned across interactions)",
            "protein_disjoint (Strict zero-overlap: evaluation proteins never seen during training)"
        ]
    )
