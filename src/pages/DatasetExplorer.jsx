import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck,
  Table,
  BarChart2,
  Filter,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid 
} from 'recharts';
import ChartCard from '../components/ChartCard';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import { DATASETS, PREPROCESSING_PROTOCOL } from '../data/datasetInfo';
import { ORGANISMS } from '../data/sampleProteins';

export default function DatasetExplorer() {
  const [selectedOrganism, setSelectedOrganism] = useState('all');
  const [selectedThreshold, setSelectedThreshold] = useState('all');
  const [activeDataset, setActiveDataset] = useState(DATASETS[0]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Filter datasets
  const filteredDatasets = DATASETS.filter(d => {
    const matchesOrg = selectedOrganism === 'all' || d.organism === selectedOrganism;
    const matchesThresh = selectedThreshold === 'all' || 
      (selectedThreshold === '800' && d.id.includes('800')) ||
      (selectedThreshold === '600' && d.id.includes('600')) ||
      (selectedThreshold === 'biogrid' && d.id.startsWith('BioGRID'));
    return matchesOrg && matchesThresh;
  });

  const chartData = filteredDatasets.map(d => ({
    name: d.id,
    positive: d.positivePairs,
    negative: d.negativePairs,
    total: d.totalPairs
  }));

  const splitData = [
    { name: 'Training (80%)', value: 80, color: '#234737' },
    { name: 'Validation (10%)', value: 10, color: '#91A88F' },
    { name: 'Test (10%)', value: 10, color: '#6B9B8B' }
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">BENCHMARK DATASETS</span>
            <span className="text-xs font-mono text-[#66786C]">• STRING v12.0 &amp; BioGRID v4.4</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Biological Interaction Dataset Explorer
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl">
            Explore curated training, validation, and test interactome partitions across Human, Yeast, Mouse, and Fruit Fly with strict 1:1 balanced sampling.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono text-[#66786C] self-start md:self-auto shadow-subtle">
          <span>Curated Pairs: <strong className="text-[#193C30]">1,472,300</strong></span>
        </div>
      </div>

      {/* Preprocessing Protocol Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8DF]">
          <ShieldCheck size={16} className="text-[#234737]" />
          <h3 className="font-heading font-bold text-[#193C30] text-sm">
            Bioinformatics Preprocessing Protocol &amp; Sampling
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1">
            <span className="font-mono text-[9px] text-[#193C30] font-bold uppercase block tracking-wider">
              1. Positive Extraction
            </span>
            <p className="text-[#52665A] leading-relaxed">
              {PREPROCESSING_PROTOCOL.positiveSampling}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1">
            <span className="font-mono text-[9px] text-[#6B9B8B] font-bold uppercase block tracking-wider">
              2. 1:1 Balanced Negatives
            </span>
            <p className="text-[#52665A] leading-relaxed">
              {PREPROCESSING_PROTOCOL.negativeSampling}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1">
            <span className="font-mono text-[9px] text-[#C69B55] font-bold uppercase block tracking-wider">
              3. GO Curation (Excl. IEA &amp; ND)
            </span>
            <p className="text-[#52665A] leading-relaxed">
              {PREPROCESSING_PROTOCOL.goFiltering}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1">
            <span className="font-mono text-[9px] text-[#234737] font-bold uppercase block tracking-wider">
              4. Stratified 80/10/10 Split
            </span>
            <p className="text-[#52665A] leading-relaxed">
              {PREPROCESSING_PROTOCOL.splittingStrategy}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Organism Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#66786C] font-mono mr-1">Organism:</span>
          <button
            onClick={() => setSelectedOrganism('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              selectedOrganism === 'all' 
                ? 'bg-[#234737] text-white font-bold' 
                : 'bg-[#EEF3EA] text-[#66786C] hover:text-[#193C30]'
            }`}
          >
            All
          </button>
          {ORGANISMS.map(org => (
            <button
              key={org.id}
              onClick={() => setSelectedOrganism(org.name)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedOrganism === org.name 
                  ? 'bg-[#234737] text-white font-bold' 
                  : 'bg-[#EEF3EA] text-[#66786C] hover:text-[#193C30]'
              }`}
            >
              <span>{org.commonName}</span>
            </button>
          ))}
        </div>

        {/* Confidence Tier Filter & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[#66786C] font-mono mr-1">Tier:</span>
          <select
            value={selectedThreshold}
            onChange={(e) => setSelectedThreshold(e.target.value)}
            className="bg-[#EEF3EA] text-[#193C30] text-xs px-2.5 py-1.5 rounded-xl border border-[#E2E8DF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="800">STRING High Conf (≥800)</option>
            <option value="600">STRING Med-High (≥600)</option>
            <option value="biogrid">BioGRID Physical</option>
          </select>

          <div className="flex items-center border border-[#E2E8DF] rounded-xl overflow-hidden ml-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#234737] text-white font-semibold' : 'bg-white text-[#66786C] hover:text-[#193C30]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#234737] text-white font-semibold' : 'bg-white text-[#66786C] hover:text-[#193C30]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Visualizations: Positive vs Negative Sample Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Balanced Sample Stacked Bar Chart (8 Cols) */}
        <div className="lg:col-span-8">
          <ChartCard
            title="1:1 Balanced Interaction Sample Distribution"
            subtitle="Strictly balanced positive interactions and sampled negative controls"
            badge="Balanced 1:1"
            source="Reference Benchmark Protocol"
            height="h-68"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#66786C" fontSize={10} angle={-20} textAnchor="end" />
                <YAxis stroke="#66786C" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="positive" name="Positive Pairs" fill="#234737" stackId="a" radius={[0, 0, 3, 3]} />
                <Bar dataKey="negative" name="Negative Controls" fill="#91A88F" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* 80/10/10 Split Partition Visual (4 Cols) */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Dataset Partitioning Ratio"
            subtitle="80% Train, 10% Validation, 10% Test"
            badge="Stratified Split"
            source="Evaluation Protocol"
            height="h-68"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="45%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-xs font-mono -mt-1">
              {splitData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#66786C]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-[#193C30] font-bold">{s.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Dataset Comparison Table or Cards View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8DF] bg-[#EEF3EA] flex items-center justify-between">
            <h3 className="font-heading font-bold text-[#193C30] text-sm flex items-center gap-2">
              <Table size={15} className="text-[#91A88F]" />
              <span>Comparative Benchmark Dataset Matrix</span>
            </h3>
            <span className="text-xs font-mono text-[#66786C]">{filteredDatasets.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#EEF3EA] text-[#66786C] border-b border-[#E2E8DF] text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3">Dataset ID</th>
                  <th className="px-4 py-3">Organism</th>
                  <th className="px-4 py-3">Source Repository</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3 text-right">Positive Pairs</th>
                  <th className="px-4 py-3 text-right">Negative Pairs</th>
                  <th className="px-4 py-3 text-right">Total Pairs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF] text-[#193C30]">
                {filteredDatasets.map(d => (
                  <tr key={d.id} className="hover:bg-[#EEF3EA] transition-colors">
                    <td className="px-4 py-3 font-bold">{d.id}</td>
                    <td className="px-4 py-3 text-[#66786C]">{d.organism}</td>
                    <td className="px-4 py-3">{d.source}</td>
                    <td className="px-4 py-3">{d.threshold}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#234737]">{d.positivePairs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-[#66786C]">{d.negativePairs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold">{d.totalPairs.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <h3 className="font-heading font-bold text-[#193C30] text-base">
            Benchmark Dataset Identifiers ({filteredDatasets.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                onClick={() => setActiveDataset(dataset)}
                className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group shadow-card
                  ${activeDataset.id === dataset.id 
                    ? 'border-[#234737] ring-1 ring-[#234737]' 
                    : 'border-[#E2E8DF] hover:border-[#91A88F]'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EAF0E7] text-[#193C30] border border-[#CCD6CA]">
                      {dataset.id}
                    </span>
                    <span className="text-[10px] font-mono text-[#66786C]">{dataset.source}</span>
                  </div>

                  <h4 className="font-heading font-bold text-xs text-[#193C30] group-hover:text-[#6B9B8B] transition-colors">
                    {dataset.name}
                  </h4>

                  <p className="text-xs text-[#52665A] line-clamp-2 my-2 leading-relaxed">
                    {dataset.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] my-2.5 font-mono text-[10px]">
                    <div>
                      <span className="text-[#66786C] text-[9px] block">TOTAL PAIRS:</span>
                      <span className="text-[#193C30] font-bold">{(dataset.totalPairs).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#66786C] text-[9px] block">ORGANISM:</span>
                      <span className="text-[#234737] font-bold truncate block">{dataset.organism}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8DF] flex items-center justify-between text-[10px] font-mono text-[#66786C]">
                  <span>Threshold: <strong className="text-[#193C30]">{dataset.threshold}</strong></span>
                  <span className="text-[#193C30] font-semibold group-hover:underline">Inspect</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
