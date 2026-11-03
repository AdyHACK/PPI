"""
Dataset & Pairwise Interaction SQLAlchemy Models
Incorporates research standards for negative sampling and protein-disjoint evaluation.
"""

from sqlalchemy import Column, String, Integer, Float, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base
from backend.app.db.models.base import TimestampMixin

class Dataset(Base, TimestampMixin):
    __tablename__ = "datasets"

    id = Column(String(32), primary_key=True, index=True)  # e.g. STRING_H_800
    name = Column(String(128), nullable=False)
    source = Column(String(64), nullable=False)            # e.g. STRING Database v11.5
    organism = Column(String(64), nullable=False)          # e.g. Homo sapiens
    organism_id = Column(String(32), nullable=False)       # e.g. h_sapiens
    threshold = Column(String(64), nullable=False)         # e.g. >= 800
    total_pairs = Column(Integer, nullable=False, default=0)
    positive_pairs = Column(Integer, nullable=False, default=0)
    negative_pairs = Column(Integer, nullable=False, default=0)
    unique_proteins = Column(Integer, nullable=False, default=0)
    avg_sequence_length = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)

    # Relationships
    interactions = relationship("Interaction", back_populates="dataset", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Dataset(id='{self.id}', pairs={self.total_pairs}, org='{self.organism}')>"

class Interaction(Base, TimestampMixin):
    """
    Biological interaction pair record.
    Negative pairs are strictly marked as putative negatives (unobserved pairs),
    acknowledging the biological limitation that unobserved does not equate to
    proven non-interaction in all cellular states.
    """
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(String(32), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    protein_a_id = Column(String(32), ForeignKey("proteins.id", ondelete="CASCADE"), nullable=False, index=True)
    protein_b_id = Column(String(32), ForeignKey("proteins.id", ondelete="CASCADE"), nullable=False, index=True)
    
    is_interacting = Column(Boolean, nullable=False)      # True = positive pair; False = negative pair
    confidence_score = Column(Float, nullable=True)       # Score from source repository (e.g. 0 to 1000 in STRING)
    
    # Research Splitting Strategy (Data Leakage Mitigation)
    split_strategy = Column(String(32), nullable=False, default="random_stratified") # "random_stratified" or "protein_disjoint"
    split_partition = Column(String(16), nullable=False, default="train")            # "train", "val", "test"
    
    # Negative Sampling Documentation
    is_putative_negative = Column(Boolean, nullable=False, default=False)
    negative_sampling_method = Column(String(64), nullable=True, default="1:1_random_exclusion")

    # Relationships
    dataset = relationship("Dataset", back_populates="interactions")

    def __repr__(self):
        return f"<Interaction({self.protein_a_id} - {self.protein_b_id}, interact={self.is_interacting}, part={self.split_partition})>"
