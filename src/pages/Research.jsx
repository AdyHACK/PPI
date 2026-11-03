import React from 'react';
import { 
  BookOpen, 
  Dna, 
  Cpu, 
  ExternalLink, 
  ShieldAlert, 
  FileText, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import BotanicalBackdrop from '../components/BotanicalBackground';
import PageTransition from '../components/motion/PageTransition';

export default function Research() {
  const citations = [
    {
      title: 'Biological Multimodal Deep Learning for Protein–Protein Interaction Prediction',
      authors: 'Reference Research Methodology (Official Investigation)',
      journal: 'Bioinformatics & Computational Biology Research Architecture',
      year: '2024',
      badge: 'Reference Paper'
    },
    {
      title: 'Evolutionary Scale Modeling (ESM-2): Language models enable zero-shot prediction of the functional effects of mutations in proteins',
      authors: 'Rives, A., Meier, J., Sercu, T., Goyal, S., et al.',
      journal: 'bioRxiv / Science',
      year: '2021',
      link: 'https://github.com/facebookresearch/esm'
    },
    {
      title: 'node2vec: Scalable Feature Learning for Networks',
      authors: 'Grover, A., Leskovec, J.',
      journal: 'ACM SIGKDD International Conference on Knowledge Discovery and Data Mining',
      year: '2016',
      link: 'https://snap.stanford.edu/node2vec/'
    },
    {
      title: 'The STRING database in 2021: customizable protein-protein networks, and functional characterization of user-uploaded gene/measurement sets',
      authors: 'Szklarczyk, D., Gable, A. L., Nastou, K. C., et al.',
      journal: 'Nucleic Acids Research',
      year: '2021',
      link: 'https://string-db.org/'
    },
    {
      title: 'The BioGRID database: A curated repository of physical protein-protein interactions',
      authors: 'Oughtred, R., Rust, J., Chang, C., Breitkreutz, B. J., et al.',
      journal: 'Nucleic Acids Research',
      year: '2021',
      link: 'https://thebiogrid.org/'
    },
    {
      title: 'Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer',
      authors: 'Shazeer, N., Mirhoseini, A., Maziarz, K., Davis, A., et al.',
      journal: 'International Conference on Learning Representations (ICLR)',
      year: '2017'
    }
  ];

  return (
    <PageTransition className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">ACADEMIC RESEARCH DOSSIER</span>
            <span className="text-xs font-mono text-[#66786C]">• Research Identity: InteractomeX</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Research Methodology &amp; Scientific Dossier
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl leading-relaxed">
            InteractomeX: AI-Powered Protein–Protein Interaction Prediction Through Multimodal Biological Learning.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white border border-[#E2E8DF] shadow-card text-xs font-mono text-[#66786C] self-start md:self-auto">
          <span>Project Status: <strong className="text-[#234737]">Frontend Prototype</strong></span>
        </div>
      </div>

      {/* Distinction & Integrity Callout with Botanical Atmosphere */}
      <BotanicalBackdrop variant="hero" className="p-6 rounded-2xl bg-white border border-[#E2E8DF] shadow-card space-y-2">
        <div className="flex items-center gap-2 text-[#193C30] font-heading font-semibold text-sm">
          <Sparkles size={16} className="text-[#91A88F]" />
          <span>Independent Implementation Demarcation</span>
        </div>
        <p className="text-xs text-[#52665A] leading-relaxed">
          <strong className="text-[#193C30]">InteractomeX</strong> represents an independent engineering implementation designed for scientific visualization, clinical research interaction, and future backend integration. While our underlying theoretical methodology, tensor pipelines, and benchmark metrics faithfully reflect the scientific concepts described in the reference research paper, this frontend platform clearly distinguishes reference findings from live experimental executions. Unimplemented machine learning checkpoints are never claimed as active backend servers.
        </p>
      </BotanicalBackdrop>

      {/* Research Objective & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="scientific-card p-6 rounded-2xl space-y-3">
          <h3 className="font-heading font-semibold text-[#193C30] text-base flex items-center gap-2">
            <BookOpen size={18} className="text-[#91A88F]" />
            <span>Research Objective</span>
          </h3>
          <p className="text-xs text-[#52665A] leading-relaxed">
            The core scientific objective is to develop a robust, highly scalable multimodal deep learning framework that bridges the gap between low-level amino acid sequence representations (ESM-2) and high-level biological functional context (Node2Vec Gene Ontology), providing accurate binary interaction predictions for undirected protein pairs.
          </p>
        </div>

        <div className="scientific-card p-6 rounded-2xl space-y-3">
          <h3 className="font-heading font-semibold text-[#193C30] text-base flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#C69B55]" />
            <span>Research Motivation &amp; Challenges</span>
          </h3>
          <ul className="text-xs text-[#52665A] space-y-2 leading-relaxed list-disc list-inside">
            <li><strong className="text-[#193C30]">Experimental Cost:</strong> Physical assays (yeast two-hybrid, cryo-EM, mass spectrometry) are labor-intensive and low-throughput.</li>
            <li><strong className="text-[#193C30]">Sequence-Only Limitations:</strong> Single-modality protein language models lack subcellular compartmentalization context.</li>
            <li><strong className="text-[#193C30]">Computational Overhead:</strong> Dense multi-billion parameter networks become prohibitive without sparse routing mechanisms.</li>
          </ul>
        </div>
      </div>

      {/* Proposed Multimodal Methodology */}
      <div className="scientific-card p-6 md:p-8 rounded-2xl space-y-4">
        <h3 className="font-heading font-bold text-[#193C30] text-lg">
          Proposed Deep Learning Framework (3-Phase Pipeline)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2">
            <span className="font-mono text-[10px] text-[#91A88F] font-bold uppercase block tracking-wider">
              Phase 1: Feature Extraction
            </span>
            <p className="text-[#52665A] leading-relaxed">
              Sequences are encoded via ESM-2 (650M) and projected into a 20×64 tensor. Concurrently, Node2Vec performs biased random walks over the Gene Ontology DAG to extract 64-dimensional GO term embeddings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2">
            <span className="font-mono text-[10px] text-[#6B9B8B] font-bold uppercase block tracking-wider">
              Phase 2: Siamese MoE Encoder
            </span>
            <p className="text-[#52665A] leading-relaxed">
              Stacked multi-head self-attention layers process the concatenated multimodal tokens. 32 specialized feed-forward expert networks with a Top-K=1 router conditionally process tokens with minimal latency overhead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-2">
            <span className="font-mono text-[10px] text-[#234737] font-bold uppercase block tracking-wider">
              Phase 3: Symmetric Fusion
            </span>
            <p className="text-[#52665A] leading-relaxed">
              Element-wise multiplication (Hadamard product) provides strict commutative pair symmetry. Weighted attention pooling and linear layers yield the interaction probability in range [0.0, 1.0].
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Limitations & Open Problems */}
      <div className="p-6 rounded-2xl bg-[#EEF3EA] border border-[#C69B55]/30 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-[#C69B55] font-heading font-semibold text-base">
          <ShieldAlert size={18} />
          <span>Recognized Scientific Limitations &amp; Boundary Conditions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#52665A] leading-relaxed">
          <div>
            <strong className="text-[#193C30] block mb-1">Random Negative Sampling Protocol:</strong>
            Because non-interacting pairs are sampled uniformly from unobserved combinations, some negatives may represent biological pairs that interact under untested cellular conditions.
          </div>
          <div>
            <strong className="text-[#193C30] block mb-1">Gene Ontology Cold-Start Generalization:</strong>
            Proteins lacking curated Gene Ontology annotations require fallback zero-padding or electronic imputation, which can temporarily reduce multimodal synergy gains.
          </div>
        </div>
      </div>

      {/* Academic Citations & References */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-[#193C30] text-lg">
            Academic Bibliography &amp; Core References
          </h3>
          <span className="text-xs font-mono text-[#66786C]">{citations.length} Citations</span>
        </div>

        <div className="space-y-3">
          {citations.map((cite, idx) => (
            <div key={idx} className="scientific-card p-4 rounded-xl flex items-start justify-between gap-4 text-xs hover:border-[#91A88F]/50 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-semibold text-[#193C30] text-sm">
                    {cite.title}
                  </h4>
                  {cite.badge && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#EAF0E7] text-[#193C30] font-bold border border-[#91A88F]/30">
                      {cite.badge}
                    </span>
                  )}
                </div>
                <div className="text-[#66786C]">{cite.authors}</div>
                <div className="font-mono text-[11px] text-[#6B9B8B] font-medium">{cite.journal} ({cite.year})</div>
              </div>

              {cite.link && (
                <a
                  href={cite.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#EEF3EA] hover:bg-[#EAF0E7] text-[#66786C] hover:text-[#193C30] border border-[#E2E8DF] flex-shrink-0 transition-colors"
                  title="View Source Link"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
