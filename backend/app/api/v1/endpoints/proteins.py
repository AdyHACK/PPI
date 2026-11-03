"""
Protein Catalog & Sequence Retrieval Endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from backend.app.core.database import get_db
from backend.app.db.models.protein import Protein, ProteinGOAnnotation
from backend.app.schemas.protein import ProteinSummary, ProteinDetail, ProteinGOAnnotationSchema

router = APIRouter()

@router.get("", response_model=List[ProteinSummary])
def list_proteins(
    query: Optional[str] = Query(None, description="Search by ID, name, or gene symbol"),
    organism: Optional[str] = Query(None, description="Filter by organism"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Search and paginate curated protein catalog with sequence length and mass metrics.
    """
    q = db.query(
        Protein.id,
        Protein.gene_symbol,
        Protein.name,
        Protein.organism,
        Protein.sequence_length,
        Protein.mw_kda,
        func.count(ProteinGOAnnotation.id).label("go_term_count")
    ).outerjoin(ProteinGOAnnotation, Protein.id == ProteinGOAnnotation.protein_id).group_by(Protein.id)

    if query:
        search_filter = or_(
            Protein.id.ilike(f"%{query}%"),
            Protein.gene_symbol.ilike(f"%{query}%"),
            Protein.name.ilike(f"%{query}%")
        )
        q = q.filter(search_filter)

    if organism and organism != "all":
        q = q.filter(Protein.organism == organism)

    rows = q.offset(offset).limit(limit).all()

    return [
        ProteinSummary(
            id=row[0],
            gene_symbol=row[1],
            name=row[2],
            organism=row[3],
            sequence_length=row[4],
            mw_kda=row[5],
            go_term_count=row[6]
        )
        for row in rows
    ]

@router.get("/{protein_id}", response_model=ProteinDetail)
def get_protein_detail(protein_id: str, db: Session = Depends(get_db)):
    """
    Fetch comprehensive protein record including canonical sequence and Gene Ontology terms.
    """
    protein = db.query(Protein).filter(Protein.id == protein_id).first()

    if not protein:
        raise HTTPException(status_code=404, detail=f"Protein '{protein_id}' not found in catalog")

    go_terms = db.query(ProteinGOAnnotation).filter(ProteinGOAnnotation.protein_id == protein_id).all()

    return ProteinDetail(
        id=protein.id,
        gene_symbol=protein.gene_symbol,
        name=protein.name,
        organism=protein.organism,
        sequence=protein.sequence,
        sequence_length=protein.sequence_length,
        mw_kda=protein.mw_kda,
        go_annotations=[
            ProteinGOAnnotationSchema(
                go_id=g.go_id,
                category=g.category,
                evidence_code=g.evidence_code,
                term_name=g.term_name
            )
            for g in go_terms
        ]
    )
