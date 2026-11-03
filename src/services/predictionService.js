import { SAMPLE_PAIRS } from '../data/samplePredictions';

export const PIPELINE_STAGES = [
  { id: 1, name: 'Sequence Validation', detail: 'Validating IUPAC canonical amino acid alphabet, length constraints, and FASTA integrity.' },
  { id: 2, name: 'ESM-2 Sequence Representation', detail: 'Extracting 33-layer Transformer token representations (1280d) and projecting to 20×64 tokens.' },
  { id: 3, name: 'Gene Ontology Processing', detail: 'Parsing biological process, molecular function, and cellular component Directed Acyclic Graphs.' },
  { id: 4, name: 'Node2Vec Representation', detail: 'Performing biased second-order random walks over GO DAG to generate 64-dimensional embeddings.' },
  { id: 5, name: 'Multimodal Feature Integration', detail: 'Tensor concatenation & zero-padding of Sequence (20×64) and Ontological (20×64) tokens.' },
  { id: 6, name: 'Transformer Encoding', detail: 'Applying multi-head self-attention with pre-layer normalization and residual feed-forward pathways.' },
  { id: 7, name: 'Mixture of Experts Routing', detail: 'Sparse gating network conditionally routing tokens to 1 of 32 specialized expert networks (Top-K = 1).' },
  { id: 8, name: 'Protein-Pair Fusion', detail: 'Symmetric element-wise Hadamard multiplication: Z = X_A ⊙ X_B for commutative invariance.' },
  { id: 9, name: 'Interaction Classification', detail: 'Weighted attention pooling, linear projection, and Sigmoid calibrated probability prediction.' }
];

/**
 * Executes the simulated 9-stage multimodal prediction pipeline.
 * @param {object} proteinA 
 * @param {object} proteinB 
 * @param {string} organism 
 * @param {function} onStageUpdate 
 * @returns {Promise<object>} Prediction Result
 */
export async function runPredictionPipeline(proteinA, proteinB, organism, onStageUpdate) {
  // Check if this matches a known benchmark pair
  const matchedSample = SAMPLE_PAIRS.find(pair => 
    (pair.proteinA.sequence.substring(0, 30) === proteinA.sequence.substring(0, 30) &&
     pair.proteinB.sequence.substring(0, 30) === proteinB.sequence.substring(0, 30)) ||
    (pair.proteinA.sequence.substring(0, 30) === proteinB.sequence.substring(0, 30) &&
     pair.proteinB.sequence.substring(0, 30) === proteinA.sequence.substring(0, 30))
  );

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];
    if (onStageUpdate) {
      onStageUpdate({
        stageNumber: i + 1,
        totalStages: PIPELINE_STAGES.length,
        stageName: stage.name,
        stageDetail: stage.detail,
        progress: Math.round(((i + 1) / PIPELINE_STAGES.length) * 100)
      });
    }
    // Simulate neural forward pass latency (260-320ms per stage)
    await new Promise(resolve => setTimeout(resolve, 290));
  }

  // Calculate realistic probability
  let probability;
  let rationale;
  let selectedExpert;

  if (matchedSample) {
    probability = matchedSample.expectedProbability;
    rationale = matchedSample.rationale;
    selectedExpert = matchedSample.id === 'pair-tp53-mdm2' ? 14 : (matchedSample.id === 'pair-cdk2-ccna2' ? 7 : 23);
  } else {
    // Generate deterministic pseudo-probabilistic score based on sequence attributes
    const hash = (proteinA.sequence.slice(0, 20) + proteinB.sequence.slice(0, 20))
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Balanced distribution with realistic clustering
    const baseScore = ((hash % 1000) / 1000);
    if (baseScore > 0.45) {
      probability = Number((72.5 + (baseScore * 24.5)).toFixed(1));
    } else {
      probability = Number((8.0 + (baseScore * 28.0)).toFixed(1));
    }
    selectedExpert = (hash % 32) + 1;
    rationale = probability >= 50 
      ? 'Significant multimodal affinity detected: Sequence representations exhibit complementary hydrophobic surface patches alongside high semantic similarity in Gene Ontology cellular localization and functional annotations.'
      : 'Low interaction potential: Significant divergent biological localization or lack of electrostatic/structural motif complementarity indicates an improbable physiological interaction.';
  }

  const isInteracting = probability >= 50.0;
  const confidenceTier = probability >= 90 ? 'Very High Confidence' :
                         probability >= 75 ? 'High Confidence' :
                         probability >= 50 ? 'Moderate Interaction' :
                         probability >= 25 ? 'Low Interaction' : 'Very Low / Non-Interacting';

  const result = {
    id: 'pred-' + Date.now(),
    timestamp: new Date().toISOString(),
    proteinA: {
      id: proteinA.id || 'PROT_A',
      name: proteinA.name || 'Custom Protein A',
      length: proteinA.sequence.length,
      organism: organism || 'Homo sapiens',
      sequence: proteinA.sequence
    },
    proteinB: {
      id: proteinB.id || 'PROT_B',
      name: proteinB.name || 'Custom Protein B',
      length: proteinB.sequence.length,
      organism: organism || 'Homo sapiens',
      sequence: proteinB.sequence
    },
    organism: organism || 'Homo sapiens',
    probability: probability,
    predictedClass: isInteracting ? 'Potential Interaction Detected' : 'No Significant Interaction Detected',
    isInteracting,
    confidenceTier,
    selectedExpert,
    rationale,
    modalities: {
      sequenceWeight: 0.58,
      ontologyWeight: 0.42,
      sequenceScore: Math.min(100, Math.round(probability * 1.02)),
      ontologyScore: Math.min(100, Math.round(probability * 0.96))
    },
    featureHeatmap: generateAttentionHeatmap(),
    isSimulated: true,
    engine: 'InteractomeX Multimodal Engine (ESM-2 650M + Node2Vec + 32-MoE) [Simulated Frontend Demo]'
  };

  // Save to LocalStorage History
  savePredictionToHistory(result);

  return result;
}

/**
 * Generates sample 8x8 cross-attention token weights for visualization
 */
function generateAttentionHeatmap() {
  const rows = ['Tok1', 'Tok2', 'Tok3', 'Tok4', 'Tok5', 'Tok6', 'Tok7', 'Tok8'];
  return rows.map((r, i) => {
    const rowObj = { token: r };
    rows.forEach((c, j) => {
      const weight = i === j ? 0.75 + Math.random() * 0.2 : Math.max(0.05, Math.sin((i + 1) * (j + 1)) * 0.4 + 0.2);
      rowObj[c] = Number(weight.toFixed(2));
    });
    return rowObj;
  });
}

/**
 * LocalStorage prediction history helper
 */
export function getPredictionHistory() {
  try {
    const raw = localStorage.getItem('interactomex_prediction_history');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse history:', e);
  }
  return [];
}

export function savePredictionToHistory(prediction) {
  try {
    const current = getPredictionHistory();
    const updated = [prediction, ...current.slice(0, 24)]; // Keep latest 25
    localStorage.setItem('interactomex_prediction_history', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export function clearPredictionHistory() {
  localStorage.removeItem('interactomex_prediction_history');
}
