import React, { useState } from 'react';
import { 
  Sparkles,
  BarChart2,
  GitBranch,
  Layers,
  Activity,
  CheckCircle2,
  Table
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  LineChart, 
  Line, 
  Legend,
  CartesianGrid 
} from 'recharts';
import ChartCard from '../components/ChartCard';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import { 
  BENCHMARK_MODELS, 
  ABLATION_STUDY, 
  MOE_CONFIGURATIONS, 
  CROSS_SPECIES_EVALUATION, 
  KEY_RESEARCH_FINDINGS 
} from '../data/performanceData';

export default function ModelPerformance() {
  // Graph 7 Metric toggle state: accuracy, precision, recall, f1, auroc, auprc
  const [metricTab, setMetricTab] = useState('auroc');
  const [ablationMetric, setAblationMetric] = useState('auroc');

  const benchmarkChartData = BENCHMARK_MODELS.map(m => ({
    name: m.name.split(' (')[0],
    fullName: m.name,
    category: m.category,
    auroc: Number((m.auroc * 100).toFixed(1)),
    auprc: Number((m.auprc * 100).toFixed(1)),
    f1: Number((m.f1 * 100).toFixed(1)),
    accuracy: Number((m.accuracy * 100).toFixed(1)),
    precision: Number((m.precision * 100).toFixed(1)),
    recall: Number((m.recall * 100).toFixed(1)),
    isProposed: m.isProposed || false
  }));

  const ablationChartData = ABLATION_STUDY.map(a => ({
    name: a.configuration.split(' (')[0],
    fullName: a.configuration,
    auroc: Number((a.auroc * 100).toFixed(1)),
    auprc: Number((a.auprc * 100).toFixed(1)),
    f1: Number((a.f1 * 100).toFixed(1)),
    accuracy: Number((a.accuracy * 100).toFixed(1)),
    isOptimal: a.isOptimal || false
  }));

  const moeChartData = MOE_CONFIGURATIONS.map(m => ({
    name: `${m.experts} E (K=${m.topK})`,
    auroc: Number((m.auroc * 100).toFixed(1)),
    latency: m.latencyMs,
    isSelected: m.isSelected || false
  }));

  return (
    <PageTransition className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">SCIENTIFIC BENCHMARK SUITE</span>
            <span className="text-xs font-mono text-[#66786C]">• 9 Baselines &amp; Ablation Evaluation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Model Evaluation &amp; Benchmark Performance
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl leading-relaxed">
            Quantitative evaluation across 9 baseline paradigms, ablation experiments, expert routing capacity, and cross-species transfer generalization.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono text-[#66786C] self-start md:self-auto shadow-subtle">
          <span>Top AUROC: <strong className="text-[#193C30]">0.984 (InteractomeX)</strong></span>
        </div>
      </div>

      {/* Reference Findings Cards Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#91A88F]" />
          <h3 className="font-heading font-bold text-[#193C30] text-sm">
            Empirical Findings Reported in Reference Research
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {KEY_RESEARCH_FINDINGS.map((finding, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E2E8DF] shadow-subtle hover:border-[#91A88F] hover:-translate-y-0.5 transition-all space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-[#718074] font-bold uppercase tracking-wider block">
                  {finding.title}
                </span>
                <div className="text-base font-heading font-bold text-[#193C30] mt-1">
                  {finding.value}
                </div>
                <p className="text-xs text-[#52665A] mt-1.5 leading-relaxed">
                  {finding.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E2E8DF] text-[10px] font-mono text-[#6B9B8B]">
                {finding.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GRAPH 7: Model Performance Comparison across 6 metrics */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-[#91A88F]" />
              <h3 className="font-heading font-bold text-[#193C30] text-sm md:text-base">
                Graph 7: Baseline Model Performance Comparison on STRING_H_800
              </h3>
            </div>
            <p className="text-xs text-[#52665A]">
              Evaluated on the human high-confidence benchmark test set across 6 standard statistical metrics
            </p>
          </div>

          {/* 6 Metric Toggles: AUROC, AUPRC, F1, Accuracy, Precision, Recall */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono shadow-subtle">
            {[
              { id: 'auroc', label: 'AUROC' },
              { id: 'auprc', label: 'AUPRC' },
              { id: 'f1', label: 'F1-Score' },
              { id: 'accuracy', label: 'Accuracy' },
              { id: 'precision', label: 'Precision' },
              { id: 'recall', label: 'Recall' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMetricTab(m.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                  metricTab === m.id ? 'bg-[#234737] text-white shadow-xs' : 'text-[#66786C] hover:text-[#193C30]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <ChartCard
          title={`Graph 7: 9 Baseline Comparisons (${metricTab.toUpperCase()})`}
          subtitle="Proposed multimodal architecture compared against sequence-only, ontology-only, and geometric baselines"
          badge="STRING_H_800 Benchmark"
          source="Reference Research Paper Table 1"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkChartData} margin={{ top: 15, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#66786C" fontSize={10} angle={-25} textAnchor="end" />
              <YAxis stroke="#66786C" fontSize={11} domain={[65, 100]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                formatter={(val) => [`${val}%`, metricTab.toUpperCase()]}
              />
              <Bar dataKey={metricTab} radius={[4, 4, 0, 0]}>
                {benchmarkChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isProposed ? '#234737' : (entry.category === 'Traditional ML' ? '#C69B55' : '#91A88F')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* GRAPH 8: Ablation Study & MoE Configuration Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAPH 8: Ablation Study (6 Cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Graph 8: Interactive Ablation Analysis"
            subtitle="Evaluating individual impact of Sequence (ESM-2), GO (Node2Vec), and MoE routing"
            badge="Component Synergies"
            source="Reference Paper Section 4.2"
            height="h-68"
            action={
              <div className="flex items-center gap-1 bg-[#FAF9F3] p-0.5 rounded-lg border border-[#E2E8DF] text-[10px] font-mono">
                {['auroc', 'f1', 'accuracy'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setAblationMetric(m)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      ablationMetric === m ? 'bg-[#244A3B] text-white font-bold' : 'text-[#758379] hover:text-[#244A3B]'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ablationChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#758379" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#758379" fontSize={11} domain={[75, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(36, 74, 59, 0.08)' }}
                  formatter={(val) => [`${val}%`, ablationMetric.toUpperCase()]}
                />
                <Bar dataKey={ablationMetric} radius={[4, 4, 0, 0]}>
                  {ablationChartData.map((entry, index) => (
                    <Cell 
                      key={`ablation-cell-${index}`} 
                      fill={entry.isOptimal ? '#244A3B' : '#659A8B'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* MoE Capacity vs Latency (6 Cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="MoE Expert Scaling &amp; Latency Trade-Off"
            subtitle="Comparing 4, 8, 16, 32, and 64 experts with Top-1 vs Top-2 routing"
            badge="Conditional Compute"
            source="Reference Paper Section 4.3"
            height="h-68"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moeChartData} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#758379" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis yAxisId="left" stroke="#244A3B" fontSize={11} domain={[95, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#758379" fontSize={11} domain={[12, 20]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 8px rgba(36, 74, 59, 0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Line yAxisId="left" type="monotone" dataKey="auroc" name="AUROC (%)" stroke="#244A3B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#659A8B" strokeWidth={1.8} strokeDasharray="3 3" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Cross-Species Generalization Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
          <div>
            <h3 className="font-heading font-bold text-[#244A3B] text-sm md:text-base">
              Cross-Species Generalization Matrix
            </h3>
            <p className="text-xs text-[#758379]">
              Models trained exclusively on Human evaluated across divergent phylogenies
            </p>
          </div>
          <span className="badge-sage">Transfer Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-[#E2E8DF] text-[#758379] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Training Domain</th>
                <th className="py-2.5 px-3">Evaluation Domain</th>
                <th className="py-2.5 px-3">Phylogenetic Class</th>
                <th className="py-2.5 px-3 text-center">AUROC</th>
                <th className="py-2.5 px-3 text-center">F1-Score</th>
                <th className="py-2.5 px-3 text-right">Transfer Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF] text-[#244A3B]">
              {CROSS_SPECIES_EVALUATION.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F3] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#244A3B]">{row.trainingSpecies}</td>
                  <td className="py-2.5 px-3 text-[#244A3B]">{row.testSpecies}</td>
                  <td className="py-2.5 px-3 text-[#758379]">
                    {idx === 0 ? 'In-Domain Human' : idx === 1 ? 'Mammalian Orthologs' : idx === 2 ? 'Invertebrate Model' : 'Fungal Unicellular'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#244A3B]">{row.auroc}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#43866B]">{row.f1}</td>
                  <td className="py-2.5 px-3 text-right text-[#758379]">
                    {((row.auroc / 0.984) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
