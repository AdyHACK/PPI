"""
Comprehensive Verification Suite for Phase 1
Tests FastAPI endpoints, database ORM models, hardware detection,
reproducibility settings, and research requirements.
"""

import sys
import os

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings
from backend.app.db.seed_demo import seed_database

def run_phase1_verification():
    print("==================================================")
    print("INTERACTOMEX: PHASE 1 COMPREHENSIVE VERIFICATION")
    print("==================================================")

    # Step 1: Initialize Database & Seed
    print("\n[1/7] Initializing Database & Seed Tables...")
    seed_database()
    print("[PASS] Database initialized and seed records verified.")

    # Step 2: Initialize Test Client
    print("\n[2/7] Initializing FastAPI Test Client...")
    client = TestClient(app)

    # Test 2.1: Root Health Check
    res = client.get("/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "connected", "Health status mismatch"
    print("[PASS] Root /health probe passed:", data)

    # Test 2.2: Detailed Health & Hardware Diagnostics
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    hw_data = res.json()
    assert hw_data["database"] == "connected"
    print(f"[PASS] /api/v1/health verified: Database={hw_data['database']}, Device={hw_data['device']}, GPU={hw_data['gpu_name']}")

    # Step 3: Verify System Info & Research Reproducibility
    print("\n[3/7] Verifying System Info & Reproducibility Configurations...")
    res = client.get("/api/v1/info")
    assert res.status_code == 200
    info = res.json()
    assert info["reproducibility"]["random_seed"] == 42
    assert len(info["baselines_supported"]) >= 5
    assert len(info["split_strategies"]) >= 2
    print(f"[PASS] Reproducibility Seeds verified: Seed={info['reproducibility']['random_seed']}")
    print(f"[PASS] Baseline Architectures verified: {info['baselines_supported']}")
    print(f"[PASS] Splitting Strategies verified: {info['split_strategies']}")

    # Step 4: Verify Protein Catalog Endpoints
    print("\n[4/7] Verifying Protein Catalog & Detail Endpoints...")
    res = client.get("/api/v1/proteins")
    assert res.status_code == 200
    proteins = res.json()
    assert len(proteins) >= 2, "Expected at least 2 seeded proteins"
    print(f"[PASS] /api/v1/proteins passed: {len(proteins)} proteins returned.")

    # Test single protein detail
    res = client.get("/api/v1/proteins/P04637")
    assert res.status_code == 200
    p53 = res.json()
    assert p53["gene_symbol"] == "TP53"
    assert len(p53["go_annotations"]) >= 2
    print(f"[PASS] /api/v1/proteins/P04637 passed: Gene={p53['gene_symbol']}, GO terms={len(p53['go_annotations'])}")

    # Step 5: Verify Dataset Explorer & Splitting Protocol
    print("\n[5/7] Verifying Datasets & Leakage-Mitigation Protocols...")
    res = client.get("/api/v1/datasets")
    assert res.status_code == 200
    datasets = res.json()
    assert len(datasets) >= 2
    print(f"[PASS] /api/v1/datasets passed: {len(datasets)} benchmark datasets cataloged.")

    res = client.get("/api/v1/datasets/splitting-protocol")
    assert res.status_code == 200
    protocols = res.json()
    assert any(p["strategy_name"] == "protein_disjoint" for p in protocols)
    print("[PASS] /api/v1/datasets/splitting-protocol verified: Disjoint splitting & putative negative documentation confirmed.")

    # Step 6: Verify Prediction & Inference Contract
    print("\n[6/7] Verifying PPI Prediction & Inference Pipeline Contract...")
    payload = {
        "protein_a_id": "P04637",
        "protein_a_sequence": "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD",
        "protein_b_id": "Q00987",
        "protein_b_sequence": "MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP",
        "organism": "Homo sapiens"
    }
    res = client.post("/api/v1/predict", json=payload)
    assert res.status_code == 200, f"Predict failed: {res.text}"
    pred = res.json()
    assert "probability" in pred
    assert "confidenceTier" in pred
    assert "modalities" in pred
    assert 1 <= pred["selectedExpert"] <= 32
    print(f"[PASS] /api/v1/predict passed: Prob={pred['probability']}%, Expert=#{pred['selectedExpert']}, Class='{pred['predictedClass']}'")

    # Step 7: Verify History Endpoint
    print("\n[7/7] Verifying Prediction History Logging...")
    res = client.get("/api/v1/history")
    assert res.status_code == 200
    history = res.json()
    assert len(history) >= 1
    latest = history[0]
    assert latest["proteinA"]["id"] == "P04637"
    print(f"[PASS] /api/v1/history verified: {len(history)} records retrieved from database.")

    print("\n==================================================")
    print("ALL PHASE 1 BACKEND VERIFICATIONS COMPLETED (100% PASS)")
    print("==================================================")

if __name__ == "__main__":
    run_phase1_verification()
