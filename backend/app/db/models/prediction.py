"""
Prediction History & Experiment Run SQLAlchemy Models
Tracks live inferences, simulated demonstration runs, reproducibility seeds,
and baseline model benchmark evaluations.
"""

from datetime import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime
from backend.app.core.database import Base
from backend.app.db.models.base import TimestampMixin

class PredictionHistory(Base, TimestampMixin):
    """
    Log of pairwise PPI inferences.
    Strictly demarks simulated client-side demos from live PyTorch neural forward passes.
    """
    __tablename__ = "prediction_history"

    id = Column(String(64), primary_key=True, default=lambda: f"pred-{uuid.uuid4().hex[:12]}")
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    protein_a_id = Column(String(32), nullable=False, index=True)
    protein_a_name = Column(Text, nullable=True)
    protein_b_id = Column(String(32), nullable=False, index=True)
    protein_b_name = Column(Text, nullable=True)
    organism = Column(String(64), nullable=False, default="Homo sapiens")

    # Inferred Outputs
    probability = Column(Float, nullable=False)           # Calibrated probability [0.0 - 100.0]
    is_interacting = Column(Boolean, nullable=False)
    confidence_tier = Column(String(32), nullable=False)
    selected_expert = Column(Integer, nullable=True)       # 1 to 32 (Top-1 routed expert)
    
    sequence_score = Column(Float, nullable=True)
    ontology_score = Column(Float, nullable=True)
    sequence_weight = Column(Float, nullable=True, default=0.58)
    ontology_weight = Column(Float, nullable=True, default=0.42)
    
    rationale = Column(Text, nullable=True)
    inference_time_ms = Column(Float, nullable=True)
    
    # Rigorous Provenance Tracking
    is_simulated = Column(Boolean, nullable=False, default=False)  # True = Demo Fallback; False = Live PyTorch Forward Pass
    engine_name = Column(String(128), nullable=False)
    model_version = Column(String(32), nullable=True, default="v1.0.0")
    reproducibility_seed = Column(Integer, nullable=True)

    def __repr__(self):
        return f"<PredictionHistory({self.protein_a_id}-{self.protein_b_id}, prob={self.probability}%, sim={self.is_simulated})>"

class ExperimentRun(Base, TimestampMixin):
    """
    Evaluation record for benchmarking models on independent test sets.
    Stores real evaluation metrics (AUROC, AUPRC, F1) across InteractomeX and baseline models.
    """
    __tablename__ = "experiment_runs"

    id = Column(String(64), primary_key=True, default=lambda: f"exp-{uuid.uuid4().hex[:8]}")
    run_name = Column(String(128), nullable=False)
    dataset_id = Column(String(32), nullable=False, index=True)
    
    # Model Category & Architecture
    model_architecture = Column(String(64), nullable=False) 
    # e.g.: "InteractomeX_MoE_32", "Transformer_Dense_FFN", "MLP", "XGBoost", "RandomForest", "LogisticRegression"
    
    split_strategy = Column(String(32), nullable=False, default="random_stratified") # "random_stratified" | "protein_disjoint"
    random_seed = Column(Integer, nullable=False, default=42)
    
    # Quantitative Test Metrics
    auroc = Column(Float, nullable=True)
    auprc = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    
    # Hardware & Execution Metadata
    hardware_device = Column(String(64), nullable=True)
    epochs_trained = Column(Integer, nullable=True)
    training_duration_seconds = Column(Float, nullable=True)
    is_published_reference = Column(Boolean, nullable=False, default=False) # True if transcribed from reference research paper
    notes = Column(Text, nullable=True)

    def __repr__(self):
        return f"<ExperimentRun({self.model_architecture}, auroc={self.auroc}, ref={self.is_published_reference})>"
