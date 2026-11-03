"""
Dataset and Splitting Pydantic Schemas
"""

from typing import Optional, Dict
from pydantic import BaseModel, Field

class DatasetSummary(BaseModel):
    id: str
    name: str
    source: str
    organism: str
    organism_id: str
    threshold: str
    total_pairs: int
    positive_pairs: int
    negative_pairs: int
    unique_proteins: int
    avg_sequence_length: Optional[int] = None
    description: Optional[str] = None
    split_strategy: str = "random_stratified"

    class Config:
        from_attributes = True

class SplittingStrategyInfo(BaseModel):
    strategy_name: str = Field(description="random_stratified or protein_disjoint")
    train_ratio: float = 0.8
    val_ratio: float = 0.1
    test_ratio: float = 0.1
    leakage_prevention: str
    putative_negative_policy: str
