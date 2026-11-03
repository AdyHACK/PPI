import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  Dna, 
  Network, 
  Layers, 
  GitMerge, 
  Activity, 
  Sparkles,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { PIPELINE_STAGES } from '../services/predictionService';

const STAGE_ICONS = {
  1: Dna,
  2: Cpu,
  3: Network,
  4: Layers,
  5: Activity,
  6: Cpu,
  7: Layers,
  8: GitMerge,
  9: Sparkles
};

export default function LoadingAnimation({ currentStageInfo }) {
  const stageNum = currentStageInfo?.stageNumber || 1;
  const progress = currentStageInfo?.progress || 11;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-6 md:p-8 rounded-3xl max-w-2xl w-full mx-auto shadow-2xl border border-[#E2E8DF] relative overflow-hidden"
    >
      {/* Soft Ambient Botanical Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#91A88F]/15 blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#234737] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#66786C] uppercase">
              Multimodal Inference Pipeline ({PIPELINE_STAGES.length} Stages)
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-heading font-bold text-[#193C30]">
            Evaluating Interaction Dynamics
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4E8] border border-[#EEDFBF] text-[#C69B55] text-xs font-mono font-medium">
          <ShieldCheck size={13} />
          <span>DEMO MODE • SIMULATED INFERENCE</span>
        </div>
      </div>

      {/* Animated Molecular Folding Spinner & Progress Bar */}
      <div className="my-5 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#66786C] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#91A88F] animate-ping" />
            Stage {stageNum} of {PIPELINE_STAGES.length}
          </span>
          <span className="text-[#193C30] font-bold text-sm">{progress}%</span>
        </div>

        {/* Progress Bar with smooth Framer Motion spring */}
        <div className="w-full h-2.5 bg-[#EEF3EA] rounded-full overflow-hidden p-0.5 border border-[#E2E8DF]">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#234737] via-[#91A88F] to-[#6B9B8B] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.28 }}
          />
        </div>
      </div>

      {/* Active Stage Banner with Animated Molecular Orbital */}
      <div className="p-4 rounded-2xl bg-[#F0F4EC] border border-[#E2E8DF] mb-5 flex items-start gap-4">
        <div className="relative w-10 h-10 rounded-xl bg-white border border-[#E2E8DF] flex items-center justify-center text-[#234737] flex-shrink-0 shadow-xs">
          <Loader2 className="animate-spin text-[#91A88F]" size={20} />
          <motion.span 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-xl border border-dashed border-[#91A88F]/50"
          />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#718074] block font-bold">
            Stage 0{stageNum}: {currentStageInfo?.stageName}
          </span>
          <p className="text-xs text-[#193C30] font-medium mt-0.5 leading-relaxed">
            {currentStageInfo?.stageDetail}
          </p>
        </div>
      </div>

      {/* Pipeline Stages Tracker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {PIPELINE_STAGES.map((s) => {
          const isDone = s.id < stageNum;
          const isCurrent = s.id === stageNum;
          const Icon = STAGE_ICONS[s.id] || Cpu;

          return (
            <motion.div
              key={s.id}
              animate={{
                scale: isCurrent ? 1.02 : 1,
                borderColor: isCurrent ? '#91A88F' : '#E2E8DF'
              }}
              transition={{ duration: 0.2 }}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs
                ${isCurrent 
                  ? 'bg-[#EAF0E7] text-[#193C30] font-bold shadow-2xs' 
                  : isDone 
                  ? 'bg-white text-[#43866B]' 
                  : 'bg-[#FAF9F3] text-[#718074] opacity-50'}
              `}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] flex-shrink-0
                ${isCurrent 
                  ? 'bg-[#234737] text-white' 
                  : isDone 
                  ? 'bg-[#43866B] text-white' 
                  : 'bg-[#E2E8DF] text-[#718074]'}
              `}>
                {isDone ? <CheckCircle2 size={12} /> : s.id}
              </div>

              <span className="truncate font-mono text-[11px]">{s.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Stream Terminal Output */}
      <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] text-[10px] font-mono text-[#66786C] flex items-center gap-2">
        <Terminal size={12} className="text-[#91A88F] flex-shrink-0" />
        <span className="truncate">
          [tensor_engine] {currentStageInfo?.stageName || 'Initializing'} • Latency budget: ~290ms • Commutative Hadamard Mode
        </span>
      </div>
    </motion.div>
  );
}
