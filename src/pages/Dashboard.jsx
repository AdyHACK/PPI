import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Binary, 
  Cpu, 
  Dna, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Database,
  Calendar,
  Share2,
  Clock,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { BotanicalLeaf, BotanicalDivider, CellularPattern } from '../components/BotanicalElements';
import BotanicalBackdrop from '../components/BotanicalBackground';
import HeroProteinScene from '../components/3d/HeroProteinScene';
import { SAMPLE_PAIRS } from '../data/samplePredictions';
import { getPredictionHistory } from '../services/predictionService';

// Activity timeline data for research progression
const RESEARCH_MILESTONES = [
  { stage: '1. Ingestion', title: 'STRING v12.0 & BioGRID Curated', date: 'Phase I', status: 'Completed', detail: '148k high-confidence protein pairs extracted' },
  { stage: '2. Encoders', title: 'ESM-2 650M + Node2Vec GO DAG', date: 'Phase II', status: 'Completed', detail: '33-layer PLM + 64-dim ontological walk' },
  { stage: '3. Sparsity', title: '32-Expert MoE Layer Integration', date: 'Phase III', status: 'Benchmarked', detail: 'Top-1 conditional dispatch with latency budget' },
  { stage: '4. Fusion', title: 'Commutative Hadamard Pair Fusion', date: 'Phase IV', status: 'Active Evaluation', detail: 'Symmetric invariant prediction verification' }
];

// Graph 4: Prediction Activity over selectable date ranges (7d, 30d, 90d)
const ACTIVITY_DATA = {
  '7d': [
    { date: 'Oct 24', predictions: 24, positive: 16, negative: 8 },
    { date: 'Oct 25', predictions: 38, positive: 25, negative: 13 },
    { date: 'Oct 26', predictions: 45, positive: 31, negative: 14 },
    { date: 'Oct 27', predictions: 32, positive: 22, negative: 10 },
    { date: 'Oct 28', predictions: 58, positive: 42, negative: 16 },
    { date: 'Oct 29', predictions: 64, positive: 47, negative: 17 },
    { date: 'Oct 30', predictions: 51, positive: 36, negative: 15 }
  ],
  '30d': [
    { date: 'W1', predictions: 180, positive: 122, negative: 58 },
    { date: 'W2', predictions: 245, positive: 168, negative: 77 },
    { date: 'W3', predictions: 310, positive: 215, negative: 95 },
    { date: 'W4', predictions: 290, positive: 201, negative: 89 }
  ],
  '90d': [
    { date: 'Aug', predictions: 780, positive: 535, negative: 245 },
    { date: 'Sep', predictions: 1120, positive: 790, negative: 330 },
    { date: 'Oct', predictions: 1450, positive: 1020, negative: 430 }
  ]
};

// Graph 5: Interaction Probability Distribution (Separated Positive vs Negative)
const PROBABILITY_BINS = [
  { bin: '0.0-0.2', positive: 120, negative: 4200, label: 'Non-Interacting' },
  { bin: '0.2-0.4', positive: 340, negative: 1850, label: 'Weak Association' },
  { bin: '0.4-0.6', positive: 1120, negative: 1050, label: 'Borderline' },
  { bin: '0.6-0.8', positive: 4890, negative: 420, label: 'Moderate Conf' },
  { bin: '0.8-1.0', positive: 16850, negative: 150, label: 'High Confidence' }
];

// Organism Distribution Data
const ORGANISM_DISTRIBUTION = [
  { name: 'Homo sapiens', value: 148560, color: '#244A3B' },
  { name: 'S. cerevisiae', value: 82400, color: '#88A58B' },
  { name: 'Mus musculus', value: 98400, color: '#659A8B' },
  { name: 'D. melanogaster', value: 64200, color: '#A5B18A' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const history = getPredictionHistory();
  const [activityRange, setActivityRange] = useState('7d');

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Hero Section with Botanical & 3D Molecular Integration */}
      <BotanicalBackdrop variant="hero" className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-[#E2E8DF] shadow-card">
        {/* Subtle decorative background cellular pattern */}
        <div className="absolute -right-8 -top-8 pointer-events-none">
          <CellularPattern className="w-56 h-56 text-[#234737]" opacity={0.03} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0E7] border border-[#D1E0CE] text-[#193C30] text-xs font-mono font-medium shadow-2xs"
            >
              <BotanicalLeaf className="w-3.5 h-3.5 text-[#91A88F]" />
              <span>3D Botanical Biological Intelligence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-3xl md:text-5xl font-heading font-extrabold text-[#193C30] tracking-tight leading-tight"
            >
              Exploring the Living Network of Proteins.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm md:text-base text-[#52665A] max-w-xl leading-relaxed"
            >
              Discover biological relationships through multimodal intelligence, evolutionary protein language models, and 3D molecular interaction prediction.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={() => navigate('/predict')}
                className="btn-primary group"
              >
                <span>Start Prediction</span>
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform text-[#91A88F]" />
              </button>

              <button
                onClick={() => navigate('/architecture')}
                className="btn-secondary group"
              >
                <Cpu size={15} className="text-[#6B9B8B] group-hover:rotate-12 transition-transform" />
                <span>Explore Research Architecture</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Interactive 3D Protein Complex Visualizer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <HeroProteinScene />
          </motion.div>
        </div>
      </BotanicalBackdrop>

      {/* Statistics Section: 4 Attractive Cards with Demonstration Tag */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Protein Pairs Analyzed"
          value="148,920"
          subtitle="Curated STRING & BioGRID pairs"
          icon={Binary}
          badge="STRING_H_800"
          isDemo={true}
          botanicalAccent={true}
        />
        <StatCard
          title="Predicted Interactions"
          value="94,180"
          subtitle="High-confidence biological bindings"
          icon={Activity}
          trend="+63.2% ratio"
          isDemo={true}
          botanicalAccent={true}
        />
        <StatCard
          title="Organisms Available"
          value="4 Species"
          subtitle="Human, Yeast, Mouse, Fly"
          icon={Dna}
          badge="Cross-Species"
          isDemo={true}
          botanicalAccent={true}
        />
        <StatCard
          title="Research Metrics"
          value="0.984 AUROC"
          subtitle="0.978 AUPRC / 0.949 F1-Score"
          icon={TrendingUp}
          badge="Paper Optimal"
          isDemo={false}
          botanicalAccent={true}
        />
      </motion.div>

      {/* GRAPH 4 & GRAPH 5: Interactive Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAPH 4: Prediction Activity Over Time (7 Cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Prediction Activity Timeline"
            subtitle="Interaction prediction throughput segmented by binary classification"
            badge="Activity Log"
            source="Demonstration Session Activity"
            height="h-68"
            action={
              <div className="flex items-center gap-1 bg-[#FAF9F3] p-1 rounded-lg border border-[#E2E8DF] text-[11px] font-mono">
                {['7d', '30d', '90d'].map((rng) => (
                  <button
                    key={rng}
                    onClick={() => setActivityRange(rng)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      activityRange === rng
                        ? 'bg-[#244A3B] text-white font-semibold'
                        : 'text-[#758379] hover:text-[#244A3B]'
                    }`}
                  >
                    {rng}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA[activityRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#88A58B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#88A58B" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C87575" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C87575" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#758379" fontSize={11} tickLine={false} />
                <YAxis stroke="#758379" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(36, 74, 59, 0.08)' }}
                  itemStyle={{ color: '#244A3B' }}
                  labelStyle={{ color: '#244A3B', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="positive" name="Interacting Pairs" stroke="#88A58B" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" />
                <Area type="monotone" dataKey="negative" name="Non-Interacting" stroke="#C87575" strokeWidth={1.5} fillOpacity={1} fill="url(#colorNeg)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* GRAPH 5: Interaction Probability Distribution (5 Cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Interaction Probability Distribution"
            subtitle="Positive vs negative predictions across confidence brackets"
            badge="Binned Output"
            source="Simulated Multimodal Output"
            height="h-68"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROBABILITY_BINS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bin" stroke="#758379" fontSize={10} tickLine={false} />
                <YAxis stroke="#758379" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(36, 74, 59, 0.08)' }}
                  itemStyle={{ color: '#244A3B' }}
                  labelStyle={{ color: '#244A3B', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                <Bar dataKey="positive" name="Positive (Interacting)" fill="#43866B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="negative" name="Negative (Non-Binding)" fill="#C87575" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Middle Grid: Protein Network Preview & Organism Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Protein Interaction Network Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-[#244A3B] text-sm md:text-base">
                    Protein Interaction Network Preview
                  </h3>
                  <span className="badge-sage">Graph 1</span>
                </div>
                <p className="text-xs text-[#758379] mt-0.5">
                  Topological interactome preview of human signaling hubs and regulatory cascades
                </p>
              </div>
              <Link 
                to="/network" 
                className="px-3 py-1.5 rounded-lg bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] hover:border-[#88A58B] text-[#244A3B] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Share2 size={13} className="text-[#88A58B]" />
                <span>Open Full Graph</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* Interactive mini canvas preview */}
            <div className="relative h-48 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] p-3 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                {/* Network edges */}
                <line x1="80" y1="80" x2="160" y2="45" stroke="#E2E8DF" strokeWidth="2" />
                <line x1="160" y1="45" x2="250" y2="60" stroke="#E2E8DF" strokeWidth="2.5" />
                <line x1="160" y1="45" x2="190" y2="120" stroke="#E2E8DF" strokeWidth="1.8" />
                <line x1="250" y1="60" x2="330" y2="90" stroke="#E2E8DF" strokeWidth="2" />
                <line x1="190" y1="120" x2="280" y2="135" stroke="#E2E8DF" strokeWidth="1.5" />
                <line x1="80" y1="80" x2="110" y2="135" stroke="#E2E8DF" strokeWidth="1.5" />
                <line x1="110" y1="135" x2="190" y2="120" stroke="#E2E8DF" strokeWidth="1.8" />

                {/* Nodes with biological styling */}
                <circle cx="80" cy="80" r="14" fill="#FFFFFF" stroke="#244A3B" strokeWidth="2" />
                <text x="80" y="84" textAnchor="middle" fill="#244A3B" fontSize="9" fontWeight="bold">TP53</text>

                <circle cx="160" cy="45" r="16" fill="#FFFFFF" stroke="#88A58B" strokeWidth="2.5" />
                <text x="160" y="49" textAnchor="middle" fill="#244A3B" fontSize="9" fontWeight="bold">MDM2</text>

                <circle cx="250" cy="60" r="18" fill="#244A3B" />
                <text x="250" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">EGFR</text>

                <circle cx="330" cy="90" r="13" fill="#FFFFFF" stroke="#659A8B" strokeWidth="2" />
                <text x="330" y="94" textAnchor="middle" fill="#244A3B" fontSize="8" fontWeight="bold">GRB2</text>

                <circle cx="190" cy="120" r="15" fill="#FFFFFF" stroke="#A5B18A" strokeWidth="2" />
                <text x="190" y="124" textAnchor="middle" fill="#244A3B" fontSize="9" fontWeight="bold">CD4</text>

                <circle cx="280" cy="135" r="13" fill="#FFFFFF" stroke="#88A58B" strokeWidth="2" />
                <text x="280" y="139" textAnchor="middle" fill="#244A3B" fontSize="8" fontWeight="bold">LCK</text>

                <circle cx="110" cy="135" r="12" fill="#FFFFFF" stroke="#659A8B" strokeWidth="2" />
                <text x="110" y="139" textAnchor="middle" fill="#244A3B" fontSize="8" fontWeight="bold">AKT1</text>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8DF] mt-3 flex items-center justify-between text-[11px] font-mono text-[#758379]">
            <span>18 Core Nodes • 36 Curated Edges</span>
            <span className="text-[#244A3B] font-medium">Click to Explore Force Layout</span>
          </div>
        </div>

        {/* Organism Distribution Pie (5 Cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Curated Organism Distribution"
            subtitle="Curated pairs stratified across reference model organisms"
            badge="GRAPH 3"
            source="STRING & BioGRID Repositories"
            height="h-56"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORGANISM_DISTRIBUTION}
                  cx="50%"
                  cy="45%"
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ORGANISM_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(36, 74, 59, 0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono -mt-2">
              {ORGANISM_DISTRIBUTION.map((org, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: org.color }} />
                  <span className="text-[#758379] truncate">{org.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Research Activity Timeline & Compact Architecture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Research Progression Timeline (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#88A58B]" />
              <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                Research Activity Timeline
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#758379]">Methodological Roadmap</span>
          </div>

          <div className="space-y-3">
            {RESEARCH_MILESTONES.map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] text-xs">
                <div className="w-6 h-6 rounded-full bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B] font-mono font-bold text-[10px] flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-[#244A3B] text-xs">{m.title}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E2E8DF] text-[#758379]">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#758379] mt-0.5">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Architecture Summary (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#659A8B]" />
              <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                Compact Model Architecture Summary
              </h3>
            </div>
            <Link to="/architecture" className="text-xs text-[#244A3B] font-semibold hover:underline flex items-center gap-1">
              <span>Full Pipeline</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] space-y-1">
              <span className="font-mono text-[10px] text-[#88A58B] uppercase font-bold block">Sequence PLM</span>
              <div className="font-semibold text-[#244A3B]">ESM-2 (650M)</div>
              <p className="text-[10px] text-[#758379]">1280-dim before linear projection to 20×64 tokens</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] space-y-1">
              <span className="font-mono text-[10px] text-[#659A8B] uppercase font-bold block">Ontological DAG</span>
              <div className="font-semibold text-[#244A3B]">Node2Vec Walk</div>
              <p className="text-[10px] text-[#758379]">64-dim Gene Ontology term embeddings</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] space-y-1">
              <span className="font-mono text-[10px] text-[#244A3B] uppercase font-bold block">Sparse Routing</span>
              <div className="font-semibold text-[#244A3B]">32-Expert MoE</div>
              <p className="text-[10px] text-[#758379]">Top-K=1 dynamic gating with noise regularization</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] space-y-1">
              <span className="font-mono text-[10px] text-[#A5B18A] uppercase font-bold block">Pairwise Fusion</span>
              <div className="font-semibold text-[#244A3B]">Hadamard Product</div>
              <p className="text-[10px] text-[#758379]">Strictly commutative symmetric pair representation</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EEF4ED] border border-[#D1E0CE] text-[11px] font-mono text-[#244A3B] flex items-center justify-between">
            <span>Overall Model Capacity: 650M Parameters</span>
            <span className="font-semibold">Top-1 Sparse Inference</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Curated Benchmark Samples & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Curated Benchmark Samples (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                  Curated Benchmark Pairs
                </h3>
                <p className="text-xs text-[#758379]">
                  Pre-configured biological interaction pairs for quick testing
                </p>
              </div>
              <Link to="/predict" className="text-xs text-[#244A3B] hover:underline font-semibold flex items-center gap-1">
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-2">
              {SAMPLE_PAIRS.slice(0, 3).map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => navigate('/predict', { state: { prefillPair: pair } })}
                  className="p-3 rounded-xl bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8DF] flex items-center justify-center text-[#244A3B] flex-shrink-0 group-hover:border-[#88A58B]">
                      <Binary size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[#244A3B] truncate">
                        {pair.name}
                      </div>
                      <div className="text-[10px] text-[#758379] font-mono">{pair.tag} • {pair.organism}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-[#43866B]">
                      {pair.expectedProbability}%
                    </span>
                    <ArrowRight size={13} className="text-[#758379] group-hover:text-[#244A3B] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8DF] mt-3.5 flex items-center justify-between text-[11px] text-[#758379]">
            <span>ESM-2 (650M) &amp; 32-Expert MoE</span>
            <span className="font-mono text-[#244A3B] font-medium">Demonstration Mode</span>
          </div>
        </div>

        {/* Recent Analysis History (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                  Recent Analysis History
                </h3>
                <p className="text-xs text-[#758379]">
                  Recently analyzed protein pairs in this browser session
                </p>
              </div>
              <span className="text-xs font-mono text-[#758379]">
                {history.length} logged
              </span>
            </div>

            {history.length > 0 ? (
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/results', { state: { prediction: item } })}
                    className="p-3 rounded-xl bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0
                        ${item.isInteracting ? 'bg-[#EEF4ED] text-[#43866B]' : 'bg-[#FAEDED] text-[#C87575]'}
                      `}>
                        {item.probability.toFixed(0)}%
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#244A3B] truncate">
                          {item.proteinA.name || item.proteinA.id} × {item.proteinB.name || item.proteinB.id}
                        </div>
                        <div className="text-[10px] text-[#758379] font-mono">{item.organism} • {new Date(item.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <span className="text-xs text-[#244A3B] font-medium group-hover:underline">
                      Inspect
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#758379] space-y-2">
                <p>No predictions run yet in this session.</p>
                <button
                  onClick={() => navigate('/predict')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#EEF4ED] text-[#244A3B] font-semibold text-xs border border-[#D1E0CE] hover:bg-[#DDEADF] transition-colors"
                >
                  Run First Prediction
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E2E8DF] mt-3.5 flex items-center justify-between text-[11px] text-[#758379]">
            <span>Stored in Local Storage</span>
            <Link to="/results" className="text-[#244A3B] hover:underline font-medium">
              View Last Result
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
