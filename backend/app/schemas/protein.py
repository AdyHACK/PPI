"""
Protein and Gene Ontology Pydantic Schemas
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class ProteinGOAnnotationSchema(BaseModel):
    go_id: str
    category: str = Field(description="BP, MF, or CC")
    evidence_code: str
    term_name: str

    class Config:
        from_attributes = True

class ProteinBase(BaseModel):
    id: str = Field(description="UniProt ID (e.g. P04637)")
    gene_symbol: Optional[str] = None
    name: str
    organism: str = "Homo sapiens"
    sequence_length: int
    mw_kda: Optional[float] = None

class ProteinDetail(ProteinBase):
    sequence: str
    go_annotations: List[ProteinGOAnnotationSchema] = []

    class Config:
        from_attributes = True

class ProteinSummary(ProteinBase):
    go_term_count: int = 0

    class Config:
        from_attributes = True
