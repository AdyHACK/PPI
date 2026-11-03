"""
Inference History Endpoints
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.core.database import get_db
from backend.app.db.models.prediction import PredictionHistory

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def get_prediction_history(
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Fetch recent prediction history with transparent simulation and provenance indicators.
    """
    records = db.query(PredictionHistory).order_by(desc(PredictionHistory.timestamp)).limit(limit).all()

    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat() + "Z",
            "proteinA": {"id": r.protein_a_id, "name": r.protein_a_name or r.protein_a_id},
            "proteinB": {"id": r.protein_b_id, "name": r.protein_b_name or r.protein_b_id},
            "organism": r.organism,
            "probability": r.probability,
            "isInteracting": r.is_interacting,
            "confidenceTier": r.confidence_tier,
            "selectedExpert": r.selected_expert,
            "rationale": r.rationale,
            "isSimulated": r.is_simulated,
            "engine": r.engine_name,
            "inferenceTimeMs": r.inference_time_ms
        }
        for r in records
    ]
