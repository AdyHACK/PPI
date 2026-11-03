"""
Protein and Gene Ontology SQLAlchemy Models
"""

from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base
from backend.app.db.models.base import TimestampMixin

class Protein(Base, TimestampMixin):
    __tablename__ = "proteins"

    id = Column(String(32), primary_key=True, index=True)  # UniProt accession (e.g. P04637)
    gene_symbol = Column(String(32), index=True, nullable=True)
    name = Column(Text, nullable=False)
    organism = Column(String(64), index=True, nullable=False, default="Homo sapiens")
    sequence = Column(Text, nullable=False)
    sequence_length = Column(Integer, nullable=False)
    mw_kda = Column(Float, nullable=True)

    # Relationships
    go_annotations = relationship("ProteinGOAnnotation", back_populates="protein", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Protein(id='{self.id}', gene='{self.gene_symbol}', len={self.sequence_length})>"

class ProteinGOAnnotation(Base, TimestampMixin):
    __tablename__ = "protein_go_annotations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    protein_id = Column(String(32), ForeignKey("proteins.id", ondelete="CASCADE"), nullable=False, index=True)
    go_id = Column(String(16), nullable=False, index=True)  # e.g. GO:0006281
    category = Column(String(8), nullable=False)            # BP (Biological Process), MF (Molecular Function), CC (Cellular Component)
    evidence_code = Column(String(8), nullable=False)       # e.g. EXP, IDA, IPI (IEA and ND filtered out)
    term_name = Column(Text, nullable=False)

    # Relationships
    protein = relationship("Protein", back_populates="go_annotations")

    def __repr__(self):
        return f"<ProteinGOAnnotation(protein='{self.protein_id}', go='{self.go_id}', cat='{self.category}')>"
