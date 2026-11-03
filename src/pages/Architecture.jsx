import React, { useState } from 'react';
import { 
  Cpu, 
  Dna, 
  Layers, 
  GitMerge, 
  Network, 
  Activity, 
  ArrowDown
} from 'lucide-react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import MoERouterVisualizer from '../components/3d/MoERouterVisualizer';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import BotanicalBackdrop from '../components/BotanicalBackground';

export default function Architecture() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMoEExpert, setSelectedMoEExpert] = useState(14);

  const handleSimulateMoERoute = (expertNum) => {
    setSelectedMoEExpert(expertNum);
  };

  const tabs = [
    { id: 'overview', label: 'Engine Overview', icon: Layers },
    { id: 'sequence', label: 'ESM-2 Sequence PLM', icon: Dna },
    { id: 'ontology', label: 'Node2Vec Gene Ontology', icon: Network },
    { id: 'multimodal', label: 'Multimodal Fusion', icon: Layers },
    { id: 'transformer', label: 'Transformer Encoder', icon: Activity },
    { id: 'moe', label: '32-Sparse MoE', icon: Cpu },
    { id: 'pair_fusion', label: 'Symmetric Pair Fusion', icon: GitMerge }
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">DEEP LEARNING ARCHITECTURE</span>
            <span className="text-xs font-mono text-[#66786C]">• Research Specification</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Inside the InteractomeX Intelligence Engine
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl leading-relaxed">
            The platform couples evolutionary protein language models (ESM-2) with topological Gene Ontology representations, unified through Sparse Mixture of Experts.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono text-[#66786C] self-start md:self-auto shadow-card">
          <span>Parameters: <strong className="text-[#193C30]">650M + MoE</strong></span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                ${isActive 
                  ? 'bg-[#234737] text-white font-bold shadow-subtle' 
                  : 'bg-white border border-[#E2E8DF] text-[#66786C] hover:text-[#193C30] hover:bg-[#EEF3EA]'}
              `}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION A: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <ArchitectureDiagram onSelectSection={(secId) => {
            if (secId === 'embeddings') setActiveTab('sequence');
            else if (secId === 'integration') setActiveTab('multimodal');
            else if (secId === 'transformer') setActiveTab('transformer');
            else if (secId === 'moe') setActiveTab('moe');
            else if (secId === 'fusion') setActiveTab('pair_fusion');
          }} />

          {/* Core Pipeline Description Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-2">
              <h3 className="font-heading font-bold text-[#193C30] text-sm flex items-center gap-2">
                <Dna size={16} className="text-[#234737]" />
                <span>Siamese Symmetric Encoding Principle</span>
              </h3>
              <p className="text-xs text-[#52665A] leading-relaxed">
                Rather than treating Protein A and Protein B as an ordered pair (A, B) ≠ (B, A), InteractomeX processes both proteins through an identical shared Siamese encoder with shared weights. Element-wise Hadamard multiplication Z = X_A ⊙ X_B guarantees strict permutation invariance: f(A, B) ≡ f(B, A).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-2">
              <h3 className="font-heading font-bold text-[#193C30] text-sm flex items-center gap-2">
                <Cpu size={16} className="text-[#6B9B8B]" />
                <span>Sparse Conditional Computation with MoE</span>
              </h3>
              <p className="text-xs text-[#52665A] leading-relaxed">
                By replacing dense feed-forward sublayers with 32 specialized expert networks and a Top-K=1 router, InteractomeX doubles overall model capacity while adding only ~3.5% wall-clock inference latency. Auxiliary load-balancing losses prevent expert collapse during training.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION B: ESM-2 SEQUENCE PLM ================= */}
      {activeTab === 'sequence' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30]">
              <Dna size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Modality 01: Sequence Embedding
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                ESM-2 (650M) Evolutionary Language Modeling
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5 text-xs text-[#52665A] leading-relaxed">
              <p>
                The sequence modality leverages <strong className="text-[#193C30]">ESM-2 (esm2_t33_650M_UR50D)</strong>, a 33-layer Transformer model pre-trained on billions of evolutionary protein sequences from UniRef50.
              </p>
              
              <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2 font-mono text-[11px]">
                <div className="text-[#193C30] font-bold">ESM-2 Sequence Pipeline Protocol:</div>
                <div className="flex items-center gap-2 text-[#193C30]">
                  <span className="w-4 h-4 rounded-full bg-white border border-[#E2E8DF] flex items-center justify-center text-[9px]">1</span>
                  <span>Input Amino Acid Sequence: Validated against 20 canonical residues.</span>
                </div>
                <div className="flex items-center gap-2 text-[#193C30]">
                  <span className="w-4 h-4 rounded-full bg-white border border-[#E2E8DF] flex items-center justify-center text-[9px]">2</span>
                  <span>Length Truncation: Hard cutoff at <strong className="text-[#193C30]">1,024 residues</strong> per standard protocol.</span>
                </div>
                <div className="flex items-center gap-2 text-[#193C30]">
                  <span className="w-4 h-4 rounded-full bg-white border border-[#E2E8DF] flex items-center justify-center text-[9px]">3</span>
                  <span>ESM-2 Encoding: Generates a <strong className="text-[#193C30]">1,280-dimensional</strong> residue embedding.</span>
                </div>
                <div className="flex items-center gap-2 text-[#193C30]">
                  <span className="w-4 h-4 rounded-full bg-white border border-[#E2E8DF] flex items-center justify-center text-[9px]">4</span>
                  <span>Linear Projection &amp; Reshaping: 1,280d → 64d, reshaped into a <strong className="text-[#234737]">20 × 64 tensor</strong>.</span>
                </div>
              </div>

              <p>
                This dimension reduction aligns sequence features directly with Gene Ontology term vectors without discarding critical secondary structure or hydrophobic binding site signals.
              </p>
            </div>

            {/* Visual Pipeline Box */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2.5 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30] font-medium">
                Raw FASTA Sequence (L ≤ 1024 AA)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] text-[#193C30] font-bold">
                ESM-2 33-Layer Backbone (1280d)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30]">
                Linear Projection (1280d → 64d)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-[#E7F2EF] border border-[#CADED8] text-[#234737] font-bold">
                Output Tensor: 20 × 64 Matrix
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION C: NODE2VEC GO ================= */}
      {activeTab === 'ontology' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#E7F2EF] border border-[#CADED8] flex items-center justify-center text-[#6B9B8B]">
              <Network size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Modality 02: Gene Ontology Embedding
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                Node2Vec Over Directed Acyclic Graph (DAG) Networks
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5 text-xs text-[#52665A] leading-relaxed">
              <p>
                The Gene Ontology (GO) captures structured biological knowledge structured as a Directed Acyclic Graph (DAG) with hierarchical <code className="text-[#193C30] font-semibold">is-a</code> and <code className="text-[#193C30] font-semibold">part-of</code> edge relationships.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] text-[#193C30]">
                  <span className="block font-bold">BP</span>
                  <span className="text-[10px] text-[#66786C]">Biological Process</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E7F2EF] border border-[#CADED8] text-[#234737]">
                  <span className="block font-bold">MF</span>
                  <span className="text-[10px] text-[#66786C]">Molecular Function</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF4E8] border border-[#EEDFBF] text-[#C69B55]">
                  <span className="block font-bold">CC</span>
                  <span className="text-[10px] text-[#66786C]">Cellular Component</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5 font-mono text-[11px]">
                <div className="text-[#193C30] font-bold">Graph Random Walk Protocol:</div>
                <p className="text-[#52665A] leading-relaxed">
                  Biased second-order random walks parameterized by return parameter p and in-out parameter q traverse the GO ontology DAG. Node2Vec Skip-gram maximizes the probability of preserving network neighborhoods, generating continuous <strong className="text-[#193C30]">64-dimensional GO term embeddings</strong>.
                </p>
                <p className="text-[#52665A] leading-relaxed">
                  Variable-length protein GO term sets are zero-padded to length 20, producing an aligned <strong className="text-[#234737]">20 × 64 tensor</strong>.
                </p>
              </div>
            </div>

            {/* Visual Node2Vec Flow */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2.5 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30]">
                GO Directed Acyclic Graph (DAG)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] text-[#193C30] font-bold">
                Biased Random Walks (p=1.0, q=0.5)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30]">
                64-d GO Term Vectors (Skip-gram)
              </div>
              <ArrowDown size={13} className="mx-auto text-[#234737]" />
              <div className="p-2.5 rounded-lg bg-[#E7F2EF] border border-[#CADED8] text-[#234737] font-bold">
                Protein-Level Tensor: 20 × 64 Matrix
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION D: MULTIMODAL LEARNING ================= */}
      {activeTab === 'multimodal' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30]">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Cross-Modal Synergy
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                Complementary Biological Modalities
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-[#52665A] leading-relaxed">
            <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
              <h3 className="font-heading font-bold text-[#193C30] text-xs flex items-center gap-1.5">
                <Dna size={14} />
                <span>Sequence Modality Strengths &amp; Limits</span>
              </h3>
              <p>
                ESM-2 captures biophysical residue motifs, electrostatic charges, and hydrophobic contact interfaces directly from amino acid sequences.
              </p>
              <p className="text-[#193C30]">
                <strong>Limitation:</strong> Sequence alone cannot determine if two compatible proteins ever co-exist in the same cellular compartment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
              <h3 className="font-heading font-bold text-[#6B9B8B] text-xs flex items-center gap-1.5">
                <Network size={14} />
                <span>Ontology Modality Strengths &amp; Limits</span>
              </h3>
              <p>
                Gene Ontology annotations provide essential biological context: subcellular compartment co-localization and shared biological processes.
              </p>
              <p className="text-[#193C30]">
                <strong>Limitation:</strong> GO annotations are incomplete for novel uncharacterized proteins and do not capture steric binding interfaces.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] text-xs text-center text-[#193C30] font-mono font-medium">
            Multimodal Integration: [Sequence (20×64) ; GO (20×64)] → Unified Siamese Transformer Input
          </div>
        </div>
      )}

      {/* ================= SECTION E: TRANSFORMER ENCODER ================= */}
      {activeTab === 'transformer' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30]">
              <Activity size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Deep Contextual Encoding
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                Multi-Head Self-Attention &amp; Siamese Transformer
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5 text-xs text-[#52665A] leading-relaxed">
              <p>
                The encoder consists of stacked Transformer layers. Each layer computes multi-head self-attention across the combined multimodal token embeddings, enabling cross-talk between sequence motifs and ontology terms.
              </p>

              {/* Mathematical Attention Callout */}
              <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#193C30] font-bold block">
                  Scaled Dot-Product Self-Attention Formula
                </span>
                <div className="text-sm md:text-base font-mono font-bold text-[#193C30] py-1.5 text-center bg-white rounded-lg border border-[#E2E8DF]">
                  Attention(Q, K, V) = softmax( (QKᵀ) / √d_k ) V
                </div>
                <p className="text-[11px] text-[#66786C] pt-0.5">
                  Where Query (Q), Key (K), and Value (V) projections map the 64-dimensional feature tokens into lower-dimensional attention heads (d_k = 16), followed by residual addition and LayerNorm.
                </p>
              </div>

              <p>
                The standard dense feed-forward network (FFN) is replaced by the <strong className="text-[#193C30]">Sparse Mixture of Experts (MoE)</strong> layer.
              </p>
            </div>

            <div className="lg:col-span-5 p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2 text-xs font-mono">
              <h4 className="font-bold text-[#193C30] text-center border-b border-[#E2E8DF] pb-1.5 text-[11px]">
                Encoder Block Structure
              </h4>
              <div className="p-2 rounded-lg bg-white border border-[#E2E8DF] text-center text-[#193C30]">
                Multimodal Input (X)
              </div>
              <ArrowDown size={12} className="mx-auto text-[#234737]" />
              <div className="p-2 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] text-[#193C30] font-bold text-center">
                Multi-Head Self-Attention (MHSA)
              </div>
              <ArrowDown size={12} className="mx-auto text-[#234737]" />
              <div className="p-2 rounded-lg bg-white border border-[#E2E8DF] text-center text-[#66786C] text-[10px]">
                Add &amp; LayerNorm (Residual Skip)
              </div>
              <ArrowDown size={12} className="mx-auto text-[#234737]" />
              <div className="p-2 rounded-lg bg-[#E7F2EF] border border-[#CADED8] text-[#234737] font-bold text-center">
                Sparse MoE (32 Experts, Top-1)
              </div>
              <ArrowDown size={12} className="mx-auto text-[#234737]" />
              <div className="p-2 rounded-lg bg-white border border-[#E2E8DF] text-center text-[#66786C] text-[10px]">
                Add &amp; LayerNorm (Residual Skip)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION F: SPARSE MIXTURE OF EXPERTS ================= */}
      {activeTab === 'moe' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30]">
              <Cpu size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Conditional Computation
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                32-Expert Mixture of Experts (MoE) Architecture
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3.5 text-xs text-[#52665A] leading-relaxed">
              <p>
                In standard Transformers, every input token activates 100% of the feed-forward parameters. In InteractomeX, the dense FFN is replaced with <strong className="text-[#193C30]">32 distinct feed-forward expert networks</strong>.
              </p>

              <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5 font-mono text-[11px]">
                <div className="text-[#193C30] font-bold">Top-K = 1 Gating Formulation:</div>
                <div className="p-2 rounded-lg bg-white text-center font-bold text-[#193C30] border border-[#E2E8DF]">
                  G(x) = Softmax( KeepTopK( H(x), 1 ) )
                </div>
                <p className="text-[#66786C] text-[10px] pt-1">
                  Where H(x)_i = (x · W_g)_i + ε · Softplus((x · W_noise)_i) adds exploration noise during training, and an auxiliary load-balancing loss enforces uniform expert utilization.
                </p>
              </div>

              {/* Research Findings Badge */}
              <div className="p-3 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] space-y-1 text-xs">
                <span className="font-mono text-[10px] text-[#193C30] font-bold uppercase block">
                  Reference Research Empirical Findings:
                </span>
                <p className="text-[#193C30] leading-relaxed">
                  • 32 experts with Top-1 routing was determined as the optimal configuration.
                  <br />• MoE increases parameter count by <strong>&gt;2×</strong> compared with standard FFN.
                  <br />• Inference execution time increases by only <strong>~3.5%</strong>.
                </p>
              </div>
            </div>

            {/* Interactive 32-Expert Radial Visualizer */}
            <div className="lg:col-span-6">
              <MoERouterVisualizer
                selectedExpert={selectedMoEExpert}
                onSelectExpert={handleSimulateMoERoute}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION G: PAIR FUSION ================= */}
      {activeTab === 'pair_fusion' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-[#E2E8DF]">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30]">
              <GitMerge size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66786C] uppercase font-bold tracking-wider">
                Permutation-Invariant Pair Representation
              </span>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
                Symmetric Hadamard Element-Wise Feature Fusion
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5 text-xs text-[#52665A] leading-relaxed">
              <p>
                In biological interactions, binding between Protein A and Protein B is undirected: (A, B) ≡ (B, A). Concatenating vectors [X_A ; X_B] is inherently order-dependent.
              </p>

              <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#193C30] font-bold block">
                  Commutative Hadamard Product Formulation
                </span>
                <div className="text-base md:text-lg font-mono font-bold text-[#193C30] py-1.5 text-center bg-white rounded-lg border border-[#E2E8DF]">
                  Z = X_A ⊙ X_B
                </div>
                <p className="text-[11px] text-[#66786C] pt-0.5">
                  Because element-wise multiplication is commutative (X_A ⊙ X_B = X_B ⊙ X_A), this mathematical formulation guarantees that predicted binding probabilities are identical regardless of which protein is entered first.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1 font-mono text-[11px]">
                <div className="text-[#193C30] font-bold">Downstream Classification Head:</div>
                <div className="text-[#66786C]">1. Weighted Attention Pooling compresses the 20 token vectors into a single pair embedding.</div>
                <div className="text-[#66786C]">2. Linear classification layer with Sigmoid produces final probability in range [0.0, 1.0].</div>
              </div>
            </div>

            {/* Visual Symmetry Box */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-3 font-mono text-center text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30] font-bold">
                  Encoder Out: X_A
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#6B9B8B] font-bold">
                  Encoder Out: X_B
                </div>
              </div>

              <div className="p-1.5 rounded-md bg-[#EAF0E7] text-[#193C30] font-bold text-[11px]">
                ⊙ Element-Wise Multiplication
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#193C30] font-bold">
                Pair Feature Matrix: Z (20 × 64)
              </div>

              <ArrowDown size={13} className="mx-auto text-[#234737]" />

              <div className="p-2.5 rounded-lg bg-white border border-[#E2E8DF] text-[#66786C]">
                Weighted Attention Pooling
              </div>

              <ArrowDown size={13} className="mx-auto text-[#234737]" />

              <div className="p-2.5 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] text-[#234737] font-bold">
                Sigmoid Interaction Probability [0, 1]
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
