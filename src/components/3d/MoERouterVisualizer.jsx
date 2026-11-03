import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

const EXPERT_SPECIALIZATIONS = [
  'Kinase & Phosphorylation Domain Matching',
  'Nuclear Localization & DNA-Binding Clefts',
  'Zinc-Finger & Heavy Metal Coordination',
  'Hydrophobic Leucine-Zipper Dimerization',
  'Ubiquitin Conjugation & E3 Ring Ligases',
  'G-Protein Coupled Receptor (GPCR) Signaling',
  'Apoptotic Caspase Cleavage & BH3 Scaffolds',
  'Transmembrane Helix-Helix Packing',
  'SH2/SH3 Phosphotyrosine Adaptors',
  'Immune Immunoglobulin V-Set Interfaces',
  'Coiled-Coil Structural Rope Assemblies',
  'Heat-Shock Chaperone Unfolded Recognition',
  'Histone Acetylation & Chromatin Remodeling',
  'Ribosomal RNA-Protein Translation Complexes',
  'p53 Hydrophobic Transactivation Loop', // Expert 14
  'PDZ Domain C-Terminal Peptide Docking',
  'Proteasome 26S Degradation Channel',
  'Mitochondrial Outer-Membrane Permeabilization',
  'Cytoskeletal Actin/Tubulin Filament Nucleation',
  'Iron-Sulfur Cluster Redox Carriers',
  'Viral Spike / ACE2 Receptor Engagers',
  'Phosphatase Active-Site Dephosphorylation',
  'Glycosylation Sialic-Acid Lectin Receptors',
  'Cyclin / CDK Regulatory Pocket Activation',
  'Voltage-Gated Ion Channel Tetramers',
  'Autophagy ATG Ubiquitin-Like Fusions',
  'Ankyrin Repeat Structural Scaffolding',
  'DEAD-Box RNA Helicase Conformational Gates',
  'Lipid Bilayer PH-Domain Phosphoinositide',
  'Extracellular Matrix Collagen Triple Helices',
  'Immune Checkpoint PD-1 / PD-L1 Interfaces',
  'S-Adenosylmethionine Methyltransferase Pockets'
];

export default function MoERouterVisualizer({ 
  selectedExpert = 14, 
  onSelectExpert 
}) {
  const [activeExpert, setActiveExpert] = useState(selectedExpert);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setActiveExpert(selectedExpert);
  }, [selectedExpert]);

  const handleExpertClick = (expertIdx) => {
    setActiveExpert(expertIdx);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    if (onSelectExpert) onSelectExpert(expertIdx);
  };

  const radius = 135;
  const centerX = 160;
  const centerY = 160;

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E2E8DF] shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#244A3B]" />
            <h3 className="font-heading font-bold text-sm text-[#244A3B]">
              Interactive 32-Expert MoE Gating Router
            </h3>
            <span className="badge-sage">Top-1 Conditional Dispatch</span>
          </div>
          <p className="text-xs text-[#758379] mt-0.5">
            Dynamically selects exactly 1 specialized FFN expert out of 32 per input representation tensor
          </p>
        </div>

        <div className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] text-[#244A3B]">
          Active Expert: <strong className="text-[#43866B]">#{activeExpert}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radial Gating Network SVG */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-80 h-80 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full h-full select-none">
              {/* Outer orbit boundary */}
              <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#E2E8DF" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx={centerX} cy={centerY} r={radius - 35} fill="none" stroke="#EEF4ED" strokeWidth="1" />

              {/* Connecting router rays */}
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i / 32) * Math.PI * 2 - Math.PI / 2;
                const exX = centerX + Math.cos(angle) * radius;
                const exY = centerY + Math.sin(angle) * radius;
                const isSelected = activeExpert === i;

                return (
                  <line
                    key={`ray-${i}`}
                    x1={centerX}
                    y1={centerY}
                    x2={exX}
                    y2={exY}
                    stroke={isSelected ? '#244A3B' : '#E2E8DF'}
                    strokeWidth={isSelected ? 2.5 : 0.8}
                    strokeDasharray={isSelected ? 'none' : '2 2'}
                    opacity={isSelected ? 1.0 : 0.4}
                  />
                );
              })}

              {/* Firing Beam to Active Expert */}
              {(() => {
                const angle = (activeExpert / 32) * Math.PI * 2 - Math.PI / 2;
                const exX = centerX + Math.cos(angle) * radius;
                const exY = centerY + Math.sin(angle) * radius;
                return (
                  <g className="transition-all duration-300">
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={exX}
                      y2={exY}
                      stroke="#43866B"
                      strokeWidth="3.5"
                    />
                    <circle cx={exX} cy={exY} r="7" fill="#43866B" opacity="0.4" className="animate-ping" />
                  </g>
                );
              })()}

              {/* 32 Expert Nodes */}
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i / 32) * Math.PI * 2 - Math.PI / 2;
                const exX = centerX + Math.cos(angle) * radius;
                const exY = centerY + Math.sin(angle) * radius;
                const isSelected = activeExpert === i;

                return (
                  <g 
                    key={`node-${i}`} 
                    onClick={() => handleExpertClick(i)}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    <circle
                      cx={exX}
                      cy={exY}
                      r={isSelected ? 8.5 : 5.5}
                      fill={isSelected ? '#244A3B' : '#FFFFFF'}
                      stroke={isSelected ? '#43866B' : '#88A58B'}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                    />
                    <text
                      x={exX}
                      y={exY + 3}
                      textAnchor="middle"
                      fontSize={isSelected ? '8' : '6'}
                      fontWeight="bold"
                      fill={isSelected ? '#FFFFFF' : '#244A3B'}
                      fontFamily="JetBrains Mono"
                    >
                      {i}
                    </text>
                  </g>
                );
              })}

              {/* Central Gating Controller Node */}
              <circle cx={centerX} cy={centerY} r="36" fill="#FAF9F3" stroke="#244A3B" strokeWidth="2" />
              <circle cx={centerX} cy={centerY} r="30" fill="#EEF4ED" />
              <text x={centerX} y={centerY - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#244A3B" fontFamily="Manrope">
                GATING
              </text>
              <text x={centerX} y={centerY + 6} textAnchor="middle" fontSize="7.5" fill="#659A8B" fontFamily="JetBrains Mono">
                TopK=1
              </text>
              <text x={centerX} y={centerY + 16} textAnchor="middle" fontSize="6.5" fill="#758379" fontFamily="JetBrains Mono">
                W_g · X + ε
              </text>
            </svg>
          </div>
        </div>

        {/* Selected Expert Details & Mathematical Specification */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#758379] uppercase font-bold tracking-wider">
                SELECTED EXPERT #{activeExpert}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EEF4ED] text-[#244A3B] border border-[#D1E0CE]">
                Top-1 Gating Weight: 0.942
              </span>
            </div>

            <h4 className="font-heading font-bold text-sm text-[#244A3B]">
              {EXPERT_SPECIALIZATIONS[activeExpert] || `General Multimodal Expert ${activeExpert}`}
            </h4>

            <p className="text-xs text-[#758379] leading-relaxed">
              Feed-forward subnet specialized for this biophysical subclass. The input representation tensor bypasses the remaining 31 experts, reducing FLOPs by 89% while expanding parameter capacity.
            </p>
          </div>

          {/* Mathematical Formulation Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8DF] space-y-2 font-mono text-xs">
            <div className="text-[10px] text-[#758379] uppercase font-bold">Mathematical Dispatch Rule</div>
            <div className="p-2 rounded-lg bg-[#F6F7F1] border border-[#E2E8DF] text-[#244A3B] text-[11px] leading-relaxed">
              y = ∑_(i=1)^32 G(x)_i · FFN_i(x), where G(x) = Softmax(Top1(H(x)))
            </div>
            <div className="text-[10px] text-[#758379] flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#88A58B]" />
              <span>Click any of the 32 radial nodes to test routing response</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
