"""
Dataset Explorer & Splitting Protocol Endpoints
Exposes curated interaction partitions (STRING, BioGRID) and documentation on
data leakage prevention and negative sampling limitations.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.db.models.dataset import Dataset
from backend.app.schemas.dataset import DatasetSummary, SplittingStrategyInfo

router = APIRouter()

@router.get("", response_model=List[DatasetSummary])
def list_datasets(db: Session = Depends(get_db)):
    """
    List all curated PPI datasets with positive/negative sample statistics and cutoffs.
    """
    return db.query(Dataset).all()

@router.get("/splitting-protocol", response_model=List[SplittingStrategyInfo])
def get_splitting_protocols():
    """
    Provides technical documentation regarding splitting protocols, data leakage mitigation,
    and negative sampling limitations.
    """
    return [
        SplittingStrategyInfo(
            strategy_name="random_stratified",
            train_ratio=0.8,
            val_ratio=0.1,
            test_ratio=0.1,
            leakage_prevention=(
                "Random interaction partition preserves identical 1:1 positive-to-negative balance "
                "across all partitions. However, individual proteins may appear in both train and test "
                "(paired with different partners), evaluating network interpolation capacity."
            ),
            putative_negative_policy=(
                "Negative pairs are generated via random non-interacting pairing excluding known PPIs. "
                "These are treated strictly as putative negatives, acknowledging that unobserved pairs "
                "may include rare or context-dependent physical interactions not yet captured by high-throughput assays."
            )
        ),
        SplittingStrategyInfo(
            strategy_name="protein_disjoint",
            train_ratio=0.8,
            val_ratio=0.1,
            test_ratio=0.1,
            leakage_prevention=(
                "Strict zero-overlap splitting: All proteins in the test interactome are strictly excluded "
                "from the training set. This tests inductive generalization to novel, uncharacterized proteins "
                "and completely prevents sequence memorization leakage."
            ),
            putative_negative_policy=(
                "Putative negatives are generated strictly among disjoint test proteins, guaranteeing no cross-set "
                "graph topology leakage."
            )
        )
    ]
