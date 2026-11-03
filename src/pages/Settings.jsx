import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Palette, 
  Server, 
  Trash2, 
  Save, 
  Activity,
  CheckCircle2,
  Sliders,
  Database
} from 'lucide-react';
import { clearPredictionHistory } from '../services/predictionService';
import { api } from '../services/api';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';

export default function Settings() {
  const { addToast } = useOutletContext() || { addToast: () => {} };

  // Settings State persisted in localStorage
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('interactomex_accent') || 'sage');
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('interactomex_anim') !== 'false');
  const [scientificNotation, setScientificNotation] = useState(() => localStorage.getItem('interactomex_scinot') === 'true');
  const [apiEndpoint, setApiEndpoint] = useState(() => localStorage.getItem('interactomex_api_endpoint') || 'http://localhost:8000');
  const [useBackend, setUseBackend] = useState(() => localStorage.getItem('interactomex_use_backend') === 'true');
  const [pingStatus, setPingStatus] = useState(null);

  const handleSaveSettings = () => {
    localStorage.setItem('interactomex_accent', accentColor);
    localStorage.setItem('interactomex_anim', animationsEnabled);
    localStorage.setItem('interactomex_scinot', scientificNotation);
    localStorage.setItem('interactomex_api_endpoint', apiEndpoint);
    localStorage.setItem('interactomex_use_backend', useBackend);

    if (addToast) addToast({ type: 'success', message: 'Preferences saved to LocalStorage!' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local prediction history?')) {
      clearPredictionHistory();
      if (addToast) addToast({ type: 'info', message: 'Prediction history cleared.' });
    }
  };

  const handleTestBackendPing = async () => {
    setPingStatus('testing');
    const res = await api.checkHealth();
    setPingStatus(res.status);
    if (addToast) {
      addToast({
        type: res.status === 'connected' ? 'success' : 'info',
        message: res.message
      });
    }
  };

  return (
    <PageTransition className="space-y-7 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">CONFIGURATION</span>
            <span className="text-xs font-mono text-[#66786C]">• LocalStorage Persistence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Platform Settings &amp; Integration
          </h1>
          <p className="text-sm text-[#52665A] mt-0.5">
            Customize visual themes, animations, local storage caches, and future FastAPI backend endpoints.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-[#234737] hover:bg-[#193C30] text-white font-medium text-xs flex items-center gap-2 shadow-subtle hover:shadow-card transition-all self-start md:self-auto cursor-pointer"
        >
          <Save size={15} />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Visual Appearance & Theme */}
        <div className="scientific-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8DF]">
            <Palette size={18} className="text-[#91A88F]" />
            <h3 className="font-heading font-semibold text-[#193C30] text-base">
              Appearance &amp; Botanical Aesthetics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-[#66786C] font-mono uppercase text-[10px] tracking-wider mb-2">
                Primary Botanical Accent Tone
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { id: 'sage', label: 'Sage Green', color: '#91A88F' },
                  { id: 'forest', label: 'Forest Green', color: '#234737' },
                  { id: 'teal', label: 'Muted Teal', color: '#6B9B8B' },
                  { id: 'olive', label: 'Muted Olive', color: '#A8B393' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAccentColor(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      accentColor === item.id 
                        ? 'bg-[#EAF0E7] border-[#91A88F] text-[#193C30] font-semibold ring-1 ring-[#91A88F]' 
                        : 'bg-white border-[#E2E8DF] text-[#66786C] hover:bg-[#EEF3EA]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="rounded border-[#E2E8DF] text-[#91A88F] focus:ring-[#91A88F] h-4 w-4"
                />
                <div>
                  <span className="font-medium text-[#193C30] block">Enable Pipeline Animations</span>
                  <span className="text-[11px] text-[#66786C]">Show dynamic 9-stage inference progress and visual pulses</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scientificNotation}
                  onChange={(e) => setScientificNotation(e.target.checked)}
                  className="rounded border-[#E2E8DF] text-[#91A88F] focus:ring-[#91A88F] h-4 w-4"
                />
                <div>
                  <span className="font-medium text-[#193C30] block">Scientific Notation for Tensors</span>
                  <span className="text-[11px] text-[#66786C]">Format dimensional values in exponential standard form (e.g. 1.28e+3)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Future FastAPI Backend Integration Contract */}
        <div className="scientific-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-[#6B9B8B]" />
              <h3 className="font-heading font-semibold text-[#193C30] text-base">
                Future Python FastAPI Backend Integration
              </h3>
            </div>
            <span className="text-xs font-mono text-[#66786C]">Decoupled API Contract</span>
          </div>

          <p className="text-xs text-[#52665A] leading-relaxed">
            The frontend is decoupled through a centralized API service layer ready to connect to a future FastAPI &amp; PyTorch model server hosting ESM-2 (650M) and Sparse MoE weights.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#66786C] font-mono uppercase text-[10px] tracking-wider mb-1">
                FastAPI Base URL Endpoint
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="scientific-input flex-1 px-3 py-2 rounded-xl text-xs font-mono"
                />
                <button
                  onClick={handleTestBackendPing}
                  className="px-4 py-2 rounded-xl bg-[#EEF3EA] hover:bg-[#EAF0E7] border border-[#E2E8DF] text-[#193C30] font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Activity size={14} className={pingStatus === 'testing' ? 'animate-spin text-[#91A88F]' : 'text-[#91A88F]'} />
                  <span>Test Ping</span>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={useBackend}
                onChange={(e) => setUseBackend(e.target.checked)}
                className="rounded border-[#E2E8DF] text-[#91A88F] focus:ring-[#91A88F] h-4 w-4"
              />
              <div>
                <span className="font-medium text-[#193C30] block">Attempt Live Backend Connection</span>
                <span className="text-[11px] text-[#66786C]">If unreachable, seamlessly fall back to local simulated demonstration engine</span>
              </div>
            </label>

            <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] text-[11px] font-mono text-[#66786C] space-y-1.5">
              <div className="text-[#193C30] font-semibold">Planned REST Contract Endpoints:</div>
              <div>• POST /api/predict — Run pair inference</div>
              <div>• GET /api/protein/{'{protein_id}'} — Fetch canonical UniProt profile</div>
              <div>• GET /api/datasets — Fetch STRING/BioGRID metadata</div>
              <div>• GET /api/model/metrics — Fetch benchmark evaluation records</div>
            </div>
          </div>
        </div>

        {/* Data & History Management */}
        <div className="scientific-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8DF]">
            <Trash2 size={18} className="text-[#C87575]" />
            <h3 className="font-heading font-semibold text-[#193C30] text-base">
              Local Session &amp; History Cache
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-medium text-[#193C30] block">Clear Local Prediction History</span>
              <span className="text-[11px] text-[#66786C]">Removes all stored interaction analysis records from your browser</span>
            </div>

            <button
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-[#C87575]/30 text-[#C87575] font-semibold text-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear History Cache</span>
            </button>
          </div>
        </div>

        {/* Application Information */}
        <div className="scientific-card p-6 rounded-2xl space-y-3 text-xs font-mono text-[#66786C]">
          <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-2 text-[#193C30]">
            <span className="font-bold">InteractomeX Information</span>
            <span className="text-[#6B9B8B] font-medium">Production-Quality Botanical AI</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="block text-[10px] text-[#718074]">VERSION:</span>
              <span className="text-[#193C30] font-semibold">v1.2.0</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#718074]">FRAMEWORK:</span>
              <span className="text-[#193C30] font-semibold">React 18 + Vite 5</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#718074]">VISUAL ENGINE:</span>
              <span className="text-[#193C30] font-semibold">Tailwind + Recharts + Canvas + Three.js</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#718074]">AESTHETIC:</span>
              <span className="text-[#193C30] font-semibold">Soft Botanical Luxury</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
