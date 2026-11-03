import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  Cpu, 
  GitMerge, 
  Layers, 
  Network, 
  Activity, 
  Sparkles, 
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Info
} from 'lucide-react';

export default function ArchitectureDiagram({ onSelectSection }) {
  const [activeStep, setActiveStep] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const steps = [
    {
      id: 'input',
      title: '1. Dual Protein Inputs (A & B)',
      detail: 'Protein A sequence (L_A) & Protein B sequence (L_B) ingested as canonical FASTA amino acid chains.',
      icon: Dna,
      badge: 'Input Sequences',
      accentBg: 'bg-[#FAF9F3]',
      tensorDim: 'L_A × 1, L_B × 1'
    },
    {
      id: 'embeddings',
      title: '2. Dual Modality Feature Extraction',
      detail: 'ESM-2 (650M) 33-layer PLM extracts structural tokens (1280d → 64d) while Node2Vec conducts biased walks over Gene Ontology DAG (64d).',
      icon: Network,
      badge: 'ESM-2 & Node2Vec',
      accentBg: 'bg-[#EAF0E7]',
      tensorDim: '20 × 64 (PLM) + 64d (GO)'
    },
    {
      id: 'integration',
      title: '3. Multimodal Tensor Integration',
      detail: 'Orthogonal alignment and concatenation of evolutionary sequence tokens with topological ontology representations.',
      icon: Layers,
      badge: 'Multimodal Fusion',
      accentBg: 'bg-[#E7F2EF]',
      tensorDim: 'Concat[20×64 ; 20×64]'
    },
    {
      id: 'transformer',
      title: '4. Shared Siamese Transformer Encoder',
      detail: 'Deep cross-attention self-attention with Query, Key, Value tensor projections and pre-LayerNorm residual pathways.',
      icon: Activity,
      badge: 'MHSA (d_k = 16)',
      accentBg: 'bg-[#FAF9F3]',
      tensorDim: 'Attention(Q,K,V) = Softmax(QKᵀ/√d_k)V'
    },
    {
      id: 'moe',
      title: '5. Sparse Mixture of Experts (MoE)',
      detail: '32 specialized feed-forward subnets dynamically routed via a Top-1 conditional gating network with exploration noise.',
      icon: Cpu,
      badge: '32 Experts (Top-1)',
      accentBg: 'bg-[#EAF0E7]',
      tensorDim: 'G(x) = Softmax(Top1(W_g·x + ε))'
    },
    {
      id: 'fusion',
      title: '6. Symmetric Pair Hadamard Fusion',
      detail: 'Permutation-invariant commutative element-wise Hadamard product Z = X_A ⊙ X_B guaranteeing f(A, B) ≡ f(B, A).',
      icon: GitMerge,
      badge: 'Z = X_A ⊙ X_B',
      accentBg: 'bg-[#E7F2EF]',
      tensorDim: '[X_A ⊙ X_B ; |X_A - X_B|]'
    },
    {
      id: 'output',
      title: '7. Weighted Attention Pooling & Sigmoid Head',
      detail: 'Token-weighted attention pooling, linear classification head, and Sigmoid calibration producing the calibrated PPI probability.',
      icon: Sparkles,
      badge: 'Sigmoid Probability',
      accentBg: 'bg-[#EAF0E7]',
      tensorDim: 'P(PPI) ∈ [0.0, 1.0]'
    }
  ];

  // Simulation timeline loop
  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length) {
            setIsSimulating(false);
            return 0;
          }
          return next;
        });
      }, 950);
    }
    return () => clearInterval(timer);
  }, [isSimulating, steps.length]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E2E8DF] shadow-subtle relative overflow-hidden">
      {/* Background Soft Accent Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#91A88F]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E2E8DF] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#234737] animate-pulse" />
            <span className="text-[10px] font-mono text-[#66786C] uppercase tracking-wider font-bold">
              Deep Learning Architecture Pipeline
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-base md:text-xl text-[#193C30]">
            Multimodal Information Flow &amp; Tensor Transformation
          </h3>
        </div>

        {/* Biological Signal Simulation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              if (!isSimulating) setSimStep(0);
              setIsSimulating(!isSimulating);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-2xs ${
              isSimulating 
                ? 'bg-[#234737] text-white font-bold' 
                : 'bg-[#F0F4EC] text-[#193C30] hover:bg-[#EAF0E7] border border-[#D1E0CE]'
            }`}
          >
            {isSimulating ? <Pause size={12} /> : <Play size={12} className="fill-current text-[#91A88F]" />}
            <span>{isSimulating ? 'Pause Signal' : 'Simulate Biological Signal'}</span>
          </button>
        </div>
      </div>

      {/* Vertical Pipeline Flow with Travelling Particles */}
      <div className="space-y-3 relative max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;
          const isSimActive = isSimulating && simStep === idx;

          return (
            <React.Fragment key={step.id}>
              <motion.div
                layout
                animate={{
                  scale: isSimActive ? 1.025 : 1,
                  borderColor: isSimActive ? '#234737' : isSelected ? '#91A88F' : '#E2E8DF',
                  boxShadow: isSimActive 
                    ? '0 8px 24px -4px rgba(35, 71, 55, 0.12)' 
                    : isSelected 
                    ? '0 4px 16px -2px rgba(35, 71, 55, 0.06)' 
                    : '0 1px 2px rgba(35, 71, 55, 0.02)'
                }}
                transition={{ duration: 0.25 }}
                onClick={() => {
                  setActiveStep(isSelected ? null : step.id);
                  if (onSelectSection) onSelectSection(step.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 bg-white relative overflow-hidden group`}
              >
                {/* Active Simulation Signal Highlight Bar */}
                {isSimActive && (
                  <motion.div 
                    layoutId="signalHighlight"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#234737]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#234737] ${step.accentBg} border border-[#D1E0CE] group-hover:scale-105 transition-transform`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="font-heading font-bold text-[#193C30] text-xs md:text-sm">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAF0E7] text-[#193C30] border border-[#D1E0CE] self-start sm:self-auto">
                      {step.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#52665A] leading-relaxed">
                    {step.detail}
                  </p>

                  {/* Expandable Mathematical Dimension Formulation */}
                  <div className="mt-2 pt-2 border-t border-[#E2E8DF] flex items-center justify-between text-[11px] font-mono text-[#66786C]">
                    <span className="text-[10px] text-[#718074]">Tensor: {step.tensorDim}</span>
                    <span className="text-[10px] text-[#6B9B8B] font-semibold group-hover:underline">
                      {isSelected ? 'Collapse' : 'Inspect Specs →'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Animated Directional Flow Connector */}
              {idx < steps.length - 1 && (
                <div className="relative py-1 flex justify-center items-center">
                  <div className="w-0.5 h-6 bg-[#E2E8DF] relative overflow-hidden">
                    {(isSimulating || true) && (
                      <motion.div
                        className="w-full h-2.5 bg-[#91A88F] rounded-full"
                        animate={{ y: [-5, 25] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: idx * 0.15
                        }}
                      />
                    )}
                  </div>
                  <ArrowDown size={13} className="text-[#91A88F] absolute -bottom-1" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
