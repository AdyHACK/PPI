"""
Database Seeding Script for Curated Proteins & Datasets
Populates initial biological entities for local testing and API endpoints.
"""

from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, engine
from backend.app.db.models import Base, Protein, ProteinGOAnnotation, Dataset, Interaction

INITIAL_PROTEINS = [
    {
        "id": "P04637",
        "gene_symbol": "TP53",
        "name": "Cellular tumor antigen p53",
        "organism": "Homo sapiens",
        "sequence": "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD",
        "mw_kda": 43.7,
        "go": [
            {"go_id": "GO:0006281", "category": "BP", "evidence_code": "EXP", "term_name": "DNA repair"},
            {"go_id": "GO:0003700", "category": "MF", "evidence_code": "IDA", "term_name": "DNA-binding transcription factor"},
            {"go_id": "GO:0005634", "category": "CC", "evidence_code": "IDA", "term_name": "nucleus"}
        ]
    },
    {
        "id": "Q00987",
        "gene_symbol": "MDM2",
        "name": "E3 ubiquitin-protein ligase Mdm2",
        "organism": "Homo sapiens",
        "sequence": "MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP",
        "mw_kda": 55.2,
        "go": [
            {"go_id": "GO:0006511", "category": "BP", "evidence_code": "EXP", "term_name": "Ubiquitin-dependent catabolism"},
            {"go_id": "GO:0004842", "category": "MF", "evidence_code": "IDA", "term_name": "Ubiquitin-protein transferase"},
            {"go_id": "GO:0005634", "category": "CC", "evidence_code": "IDA", "term_name": "nucleus"}
        ]
    },
    {
        "id": "P24941",
        "gene_symbol": "CDK2",
        "name": "Cyclin-dependent kinase 2",
        "organism": "Homo sapiens",
        "sequence": "MENFQKVEKIGEGTYGVVYKARNKLTGEVVALKKIRLDTETEGVPSTAIREISLLKELNHPNIVKLLDVIHTENKLYLVFEFLHQDLKKFMDASALTGIPLPLIKSYLFQLLQGLAFCHSHRVLHRDLKPQNLLINTEGAIKLADFGLARAFGVPVRTYTHEVVTLWYRAPEILLGCKYYSTAVDIWSLGCIFAEMVTRRALFPGDSEIDQLFRIFRTLGTPDEVVWPGVTSMPDYKPSFPKWARQDFSKVVPPLDEDGRSLLSQMLHYDPNKRISAKAALAHPFFQDVTKPVPHLRL",
        "mw_kda": 33.9,
        "go": [
            {"go_id": "GO:0007049", "category": "BP", "evidence_code": "EXP", "term_name": "cell cycle"},
            {"go_id": "GO:0004693", "category": "MF", "evidence_code": "IDA", "term_name": "cyclin-dependent protein kinase activity"},
            {"go_id": "GO:0005634", "category": "CC", "evidence_code": "IDA", "term_name": "nucleus"}
        ]
    },
    {
        "id": "P20248",
        "gene_symbol": "CCNA2",
        "name": "Cyclin-A2",
        "organism": "Homo sapiens",
        "sequence": "MLGNSAPGPATREAGSALLALQQTALQEDQENINPEKAAPVQQPRTRAALAVLKSGNPRGLAQQQRPKTRRVAPLKDLPVNDEHVTVPPWKANSKQPAIRGERSHPRNQQQQNQQQQQEQQQQQQQQQQQQQQQQQQQPQQPQQPQQQPPQQRHRPRRAAPLVDLESELEEVPEEEEEEEEEEEEDDEDDEDDDDDDDDDDDDDDDDDDDDDDEDEEEDE",
        "mw_kda": 48.6,
        "go": [
            {"go_id": "GO:0051726", "category": "BP", "evidence_code": "EXP", "term_name": "regulation of cell cycle"},
            {"go_id": "GO:0019901", "category": "MF", "evidence_code": "IPI", "term_name": "protein kinase binding"},
            {"go_id": "GO:0005634", "category": "CC", "evidence_code": "IDA", "term_name": "nucleus"}
        ]
    }
]

INITIAL_DATASETS = [
    {
        "id": "STRING_H_800",
        "name": "STRING Human High-Confidence (≥800)",
        "source": "STRING Database v11.5",
        "organism": "Homo sapiens",
        "organism_id": "h_sapiens",
        "threshold": "≥ 800",
        "total_pairs": 148560,
        "positive_pairs": 74280,
        "negative_pairs": 74280,
        "unique_proteins": 11420,
        "avg_sequence_length": 524,
        "description": "Human protein pairs with experimental and database evidence scores >= 800."
    },
    {
        "id": "STRING_H_600",
        "name": "STRING Human Medium-High (≥600)",
        "source": "STRING Database v11.5",
        "organism": "Homo sapiens",
        "organism_id": "h_sapiens",
        "threshold": "≥ 600",
        "total_pairs": 326400,
        "positive_pairs": 163200,
        "negative_pairs": 163200,
        "unique_proteins": 14890,
        "avg_sequence_length": 508,
        "description": "Extended human interaction network with confidence >= 600."
    },
    {
        "id": "BioGRID_H",
        "name": "BioGRID Human Physical Interactome",
        "source": "BioGRID Database v4.4",
        "organism": "Homo sapiens",
        "organism_id": "h_sapiens",
        "threshold": "Curated Physical Evidence",
        "total_pairs": 112800,
        "positive_pairs": 56400,
        "negative_pairs": 56400,
        "unique_proteins": 10840,
        "avg_sequence_length": 532,
        "description": "Biomedical repository of physical protein-protein interactions curated from primary literature."
    }
]

def seed_database(db: Session = None):
    """Initializes tables and seeds initial entities synchronously."""
    Base.metadata.create_all(bind=engine)
    
    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        # 1. Seed Proteins
        for p_data in INITIAL_PROTEINS:
            existing = db.query(Protein).filter_by(id=p_data["id"]).first()
            if not existing:
                prot = Protein(
                    id=p_data["id"],
                    gene_symbol=p_data.get("gene_symbol"),
                    name=p_data["name"],
                    organism=p_data["organism"],
                    sequence=p_data["sequence"],
                    sequence_length=len(p_data["sequence"]),
                    mw_kda=p_data.get("mw_kda")
                )
                db.add(prot)
                db.flush()

                for go in p_data.get("go", []):
                    go_ann = ProteinGOAnnotation(
                        protein_id=prot.id,
                        go_id=go["go_id"],
                        category=go["category"],
                        evidence_code=go["evidence_code"],
                        term_name=go["term_name"]
                    )
                    db.add(go_ann)

        # 2. Seed Datasets
        for d_data in INITIAL_DATASETS:
            existing = db.query(Dataset).filter_by(id=d_data["id"]).first()
            if not existing:
                ds = Dataset(**d_data)
                db.add(ds)

        db.commit()
    finally:
        if close_session:
            db.close()

if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully.")
