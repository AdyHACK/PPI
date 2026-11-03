/**
 * Centralized API Service Layer
 * Designed for future integration with Python FastAPI & PyTorch Model inference server.
 * Currently defaults to the local simulated demonstration engine.
 */

import { runPredictionPipeline, getPredictionHistory } from './predictionService';
import { SAMPLE_PROTEINS } from '../data/sampleProteins';
import { DATASETS } from '../data/datasetInfo';
import { BENCHMARK_MODELS } from '../data/performanceData';

const CONFIG = {
  // Configurable future FastAPI base URL (e.g., 'http://localhost:8000')
  baseUrl: localStorage.getItem('interactomex_api_endpoint') || 'http://localhost:8000',
  useBackend: localStorage.getItem('interactomex_use_backend') === 'true',
  timeoutMs: 10000
};

export const api = {
  /**
   * Status ping to test future backend connectivity
   */
  async checkHealth() {
    if (!CONFIG.useBackend) {
      return { status: 'demo_mode', message: 'Running in Client-Side Simulated Demo Mode' };
    }
    try {
      const res = await fetch(`${CONFIG.baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return { status: 'connected', message: 'Connected to Live FastAPI Engine' };
      }
    } catch {
      return { status: 'offline', message: 'FastAPI Backend Unreachable. Falling back to Demo Mode.' };
    }
  },

  /**
   * POST /api/predict
   * Dispatches prediction to backend if configured, or runs local 8-stage pipeline
   */
  async predictInteraction(proteinA, proteinB, organism, onProgress) {
    if (CONFIG.useBackend) {
      try {
        const response = await fetch(`${CONFIG.baseUrl}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            protein_a_id: proteinA.id,
            protein_a_seq: proteinA.sequence,
            protein_b_id: proteinB.id,
            protein_b_seq: proteinB.sequence,
            organism: organism
          })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Backend prediction failed, using simulated pipeline:', err);
      }
    }

    // Default: Client-side simulated multimodal pipeline
    return await runPredictionPipeline(proteinA, proteinB, organism, onProgress);
  },

  /**
   * GET /api/protein/{protein_id}
   */
  async getProtein(proteinId) {
    const found = SAMPLE_PROTEINS.find(p => p.id === proteinId || p.geneSymbol?.toUpperCase() === proteinId.toUpperCase());
    return found || null;
  },

  /**
   * GET /api/datasets
   */
  async getDatasets() {
    return DATASETS;
  },

  /**
   * GET /api/model/metrics
   */
  async getModelMetrics() {
    return BENCHMARK_MODELS;
  },

  /**
   * GET /api/predictions/history
   */
  async getHistory() {
    return getPredictionHistory();
  }
};
