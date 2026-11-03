"""
Prediction & Inference Pydantic Schemas
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    protein_a_id: str = Field(..., description="UniProt ID or Identifier for Protein A")
    protein_a_sequence: str = Field(..., description="Canonical IUPAC amino acid sequence")
    protein_b_id: str = Field(..., description="UniProt ID or Identifier for Protein B")
    protein_b_sequence: str = Field(..., description="Canonical IUPAC amino acid sequence")
    organism: str = Field(default="Homo sapiens", description="Target organism")
    precomputed_only: bool = Field(default=False, description="Whether to only check cached embeddings")

class ModalityWeights(BaseModel):
    sequenceWeight: float = 0.58
    ontologyWeight: float = 0.42
    sequenceScore: float
    ontologyScore: float

class PredictResponse(BaseModel):
    id: str
    timestamp: str
    proteinA: Dict[str, Any]
    proteinB: Dict[str, Any]
    organism: str
    probability: float = Field(..., ge=0.0, le=100.0, description="Calibrated PPI probability (0-100%)")
    predictedClass: str
    isInteracting: bool
    confidenceTier: str
    selectedExpert: Optional[int] = Field(None, ge=1, le=32, description="Active 1 of 32 MoE Experts")
    rationale: str
    modalities: ModalityWeights
    isSimulated: bool = Field(default=False, description="False if computed via live PyTorch model; True if demo fallback")
    engine: str
    inferenceTimeMs: Optional[float] = None
    modelVersion: str = "v1.0.0"

class ExperimentMetricResponse(BaseModel):
    model_architecture: str
    category: str
    auroc: float
    auprc: float
    f1: float
    accuracy: float
    precision: float
    recall: float
    source: str
    source_type: str = Field(description="REF_PAPER or LIVE_EXPERIMENT")
    is_proposed: bool = False
