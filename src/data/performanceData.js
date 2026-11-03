/**
 * Performance evaluation metrics, baseline benchmark comparisons,
 * ablation studies, and MoE routing analysis.
 *
 * All records strictly distinguish:
 * [REF_PAPER] = Reported in the Reference Research Paper
 * [PROTOTYPE] = Our independent frontend reproduction / test
 * [DEMO] = Illustrative demonstration data
 */

export const BENCHMARK_MODELS = [
  {
    name: 'XGBoost (Baseline)',
    category: 'Traditional ML',
    modality: 'Handcrafted features',
    accuracy: 0.724,
    precision: 0.718,
    recall: 0.738,
    f1: 0.728,
    auroc: 0.792,
    auprc: 0.781,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'Node2Vec',
    category: 'Graph Embedding',
    modality: 'Network topology only',
    accuracy: 0.762,
    precision: 0.755,
    recall: 0.776,
    f1: 0.765,
    auroc: 0.835,
    auprc: 0.824,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'Onto2Vec',
    category: 'Ontology Embedding',
    modality: 'GO Axioms / Word2Vec',
    accuracy: 0.784,
    precision: 0.778,
    recall: 0.795,
    f1: 0.786,
    auroc: 0.858,
    auprc: 0.846,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'Opa2Vec',
    category: 'Ontology Embedding',
    modality: 'GO + Metadata annotations',
    accuracy: 0.806,
    precision: 0.798,
    recall: 0.820,
    f1: 0.809,
    auroc: 0.881,
    auprc: 0.872,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'D-SCRIPT',
    category: 'Deep Learning',
    modality: 'Sequence-only contact map',
    accuracy: 0.835,
    precision: 0.829,
    recall: 0.846,
    f1: 0.837,
    auroc: 0.908,
    auprc: 0.901,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'ProtBERT + MLP',
    category: 'Deep Learning',
    modality: 'Sequence PLM only',
    accuracy: 0.862,
    precision: 0.854,
    recall: 0.875,
    f1: 0.864,
    auroc: 0.931,
    auprc: 0.925,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'TransformerGO',
    category: 'Deep Learning',
    modality: 'Gene Ontology attention',
    accuracy: 0.884,
    precision: 0.876,
    recall: 0.895,
    f1: 0.885,
    auroc: 0.946,
    auprc: 0.939,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'TUnA',
    category: 'Deep Learning',
    modality: 'Unified graph-sequence',
    accuracy: 0.897,
    precision: 0.891,
    recall: 0.906,
    f1: 0.898,
    auroc: 0.957,
    auprc: 0.951,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'SpatialPPIv2',
    category: 'Deep Learning',
    modality: 'Geometric structure + PLM',
    accuracy: 0.912,
    precision: 0.908,
    recall: 0.918,
    f1: 0.913,
    auroc: 0.968,
    auprc: 0.962,
    source: 'Reported in Reference Research Paper',
    sourceType: 'REF_PAPER'
  },
  {
    name: 'InteractomeX (Reference Paper Model)',
    category: 'Multimodal Deep Learning',
    modality: 'ESM-2 + Node2Vec GO + Sparse MoE',
    accuracy: 0.948,
    precision: 0.942,
    recall: 0.956,
    f1: 0.949,
    auroc: 0.984,
    auprc: 0.978,
    source: 'Reported in Reference Research Paper (Optimal Configuration)',
    sourceType: 'REF_PAPER',
    isProposed: true
  }
];

export const ABLATION_STUDY = [
  {
    configuration: 'Sequence Only (ESM-2 650M)',
    description: 'Ablating GO embeddings; relies solely on 20x64 projected protein language model features.',
    accuracy: 0.878,
    f1: 0.874,
    auroc: 0.938,
    auprc: 0.931,
    source: 'Reported in Reference Research Paper'
  },
  {
    configuration: 'Gene Ontology Only (Node2Vec)',
    description: 'Ablating sequence representations; uses solely 64-d Node2Vec GO term representations.',
    accuracy: 0.842,
    f1: 0.838,
    auroc: 0.912,
    auprc: 0.904,
    source: 'Reported in Reference Research Paper'
  },
  {
    configuration: 'Multimodal + Standard FFN (No MoE)',
    description: 'Full multimodal inputs but replacing Sparse MoE with conventional feed-forward network.',
    accuracy: 0.923,
    f1: 0.920,
    auroc: 0.965,
    auprc: 0.959,
    source: 'Reported in Reference Research Paper'
  },
  {
    configuration: 'Full Proposed (Multimodal + 32-Expert MoE)',
    description: 'Optimal architecture combining ESM-2, Node2Vec GO, and 32-Expert Top-1 Sparse Router.',
    accuracy: 0.948,
    f1: 0.949,
    auroc: 0.984,
    auprc: 0.978,
    source: 'Reported in Reference Research Paper',
    isOptimal: true
  }
];

export const MOE_CONFIGURATIONS = [
  { experts: 4, topK: 1, auroc: 0.968, f1: 0.928, paramMultiplier: '1.25x', latencyMs: 14.2 },
  { experts: 8, topK: 1, auroc: 0.973, f1: 0.935, paramMultiplier: '1.45x', latencyMs: 14.5 },
  { experts: 16, topK: 1, auroc: 0.979, f1: 0.942, paramMultiplier: '1.78x', latencyMs: 14.8 },
  { experts: 32, topK: 1, auroc: 0.984, f1: 0.949, paramMultiplier: '2.14x', latencyMs: 15.2, isSelected: true },
  { experts: 32, topK: 2, auroc: 0.983, f1: 0.948, paramMultiplier: '2.14x', latencyMs: 18.6 },
  { experts: 64, topK: 1, auroc: 0.985, f1: 0.950, paramMultiplier: '3.62x', latencyMs: 17.8 }
];

export const CROSS_SPECIES_EVALUATION = [
  { trainingSpecies: 'H. sapiens (STRING_H_800)', testSpecies: 'H. sapiens (Test)', auroc: 0.984, f1: 0.949 },
  { trainingSpecies: 'H. sapiens (STRING_H_800)', testSpecies: 'M. musculus (STRING_M)', auroc: 0.962, f1: 0.924 },
  { trainingSpecies: 'H. sapiens (STRING_H_800)', testSpecies: 'D. melanogaster (STRING_D)', auroc: 0.931, f1: 0.887 },
  { trainingSpecies: 'H. sapiens (STRING_H_800)', testSpecies: 'S. cerevisiae (STRING_S_800)', auroc: 0.918, f1: 0.872 }
];

export const KEY_RESEARCH_FINDINGS = [
  {
    title: 'Optimal MoE Configuration',
    value: '32 Experts, Top-K = 1',
    description: 'Reference research paper experiments demonstrated that 32 experts with sparse Top-1 routing yielded the optimal trade-off between model capacity and computational overhead.',
    source: 'Reference Paper Section 4.3'
  },
  {
    title: 'Parameter Scaling vs Latency',
    value: '+2.14× Params / +3.5% Latency',
    description: 'Replacing standard FFN with 32 experts increased total model parameters by >2x, while actual inference wall-clock time rose by only approximately 3.5% thanks to sparse conditional execution.',
    source: 'Reference Paper Section 4.4'
  },
  {
    title: 'Encoder-Only Efficiency Gain',
    value: '~10% Training Time Reduction',
    description: 'Omitting an autoregressive decoder in favor of a shared symmetric Siamese encoder reduced per-epoch training time by ~10% while preserving permutation symmetry.',
    source: 'Reference Paper Section 3.2'
  },
  {
    title: 'Multimodal Synergy Gain',
    value: '+4.6% AUROC over Sequence Alone',
    description: 'Fusing Node2Vec Gene Ontology topology embeddings with ESM-2 protein language model representations bridged functional annotation gaps and significantly reduced false positives.',
    source: 'Reference Paper Ablation Study'
  }
];
