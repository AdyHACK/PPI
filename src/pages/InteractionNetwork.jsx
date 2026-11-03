import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Share2, 
  BarChart3, 
  SlidersHorizontal, 
  Info, 
  Filter, 
  HelpCircle,
  Dna,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import NetworkGraph from '../components/NetworkGraph';
import MolecularNetwork3D from '../components/3d/MolecularNetwork3D';
import ChartCard from '../components/ChartCard';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import { NETWORK_CLUSTERS, NETWORK_NODES, NETWORK_EDGES } from '../data/networkData';

// Graph 2: Interaction Confidence Score Distribution with filterable datasets/organisms
const CONFIDENCE_DISTRIBUTIONS = {
  all: [
    { bracket: '0.40–0.50', count: 18450, evidence: 'Low / Genomic Context' },
    { bracket: '0.50–0.60', count: 24200, evidence: 'Moderate Text Mining' },
    { bracket: '0.60–0.70', count: 31800, evidence: 'Co-expression Supported' },
    { bracket: '0.70–0.80', count: 48900, evidence: 'Orthology & Assays' },
    { bracket: '0.80–0.90', count: 62400, evidence: 'High Biochemical Validation' },
    { bracket: '0.90–1.00', count: 78500, evidence: 'Gold Standard Physical Assays' }
  ],
  human: [
    { bracket: '0.40–0.50', count: 9200, evidence: 'Low Context' },
    { bracket: '0.50–0.60', count: 12500, evidence: 'Moderate' },
    { bracket: '0.60–0.70', count: 17400, evidence: 'Co-expression' },
    { bracket: '0.70–0.80', count: 26800, evidence: 'Physical & Curated' },
    { bracket: '0.80–0.90', count: 35100, evidence: 'High Confidence' },
    { bracket: '0.90–1.00', count: 47560, evidence: 'Gold Standard' }
  ],
  yeast: [
    { bracket: '0.40–0.50', count: 4100, evidence: 'Low Context' },
    { bracket: '0.50–0.60', count: 5800, evidence: 'Moderate' },
    { bracket: '0.60–0.70', count: 7200, evidence: 'Co-expression' },
    { bracket: '0.70–0.80', count: 11200, evidence: 'Physical Assays' },
    { bracket: '0.80–0.90', count: 14800, evidence: 'High Confidence' },
    { bracket: '0.90–1.00', count: 39300, evidence: 'Gold Standard (Y2H)' }
  ]
};

// Graph 3: Organism-wise Comparative Interaction Analysis
const ORGANISM_COMPARISON = [
  { organism: 'Homo sapiens', samples: 148560, interactions: 94180 },
  { organism: 'S. cerevisiae', samples: 82400, interactions: 48200 },
  { organism: 'Mus musculus', samples: 98400, interactions: 58100 },
  { organism: 'D. melanogaster', samples: 64200, interactions: 36800 }
];

export default function InteractionNetwork() {
  const navigate = useNavigate();
  const [networkMode, setNetworkMode] = useState('3d'); // '3d' | '2d'
  const [confidenceOrganism, setConfidenceOrganism] = useState('all');
  const [selectedDataset, setSelectedDataset] = useState('STRING');

  const handleSelectProteinForPrediction = (node) => {
    navigate('/predict', {
      state: {
        prefillPair: {
          name: `${node.id} Network Exploration`,
          organism: node.organism,
          proteinA: {
            id: node.uniprotId || node.id,
            name: node.name,
            sequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD'
          },
          proteinB: {
            id: 'Q00987',
            name: 'E3 ubiquitin-protein ligase Mdm2 (MDM2)',
            sequence: 'MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP'
          }
        }
      }
    });
  };

  return (
    <PageTransition className="space-y-7">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">INTERACTION TOPOLOGY</span>
            <span className="text-xs font-mono text-[#66786C]">• Force-Directed Biological Subgraph</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Interactive Protein Interaction Network &amp; Analytics
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl">
            Explore topological clusters, edge confidence weights, and hub connectivity across curated STRING v12.0 and BioGRID complexes.
          </p>
        </div>

        {/* Network Metrics Overview */}
        <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono self-start md:self-auto shadow-card">
          <div>
            <span className="text-[#718074] block text-[10px]">GRAPH 1 NODES</span>
            <span className="text-[#193C30] font-bold">{NETWORK_NODES.length} Curated</span>
          </div>
          <div className="h-5 w-px bg-[#E2E8DF]" />
          <div>
            <span className="text-[#718074] block text-[10px]">VERIFIED EDGES</span>
            <span className="text-[#234737] font-bold">{NETWORK_EDGES.length} Links</span>
          </div>
          <div className="h-5 w-px bg-[#E2E8DF]" />
          <div>
            <span className="text-[#718074] block text-[10px]">MODULES</span>
            <span className="text-[#6B9B8B] font-bold">{NETWORK_CLUSTERS.length} Clusters</span>
          </div>
        </div>
      </div>

      {/* Cluster Legend Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#193C30] font-semibold">
          <Share2 size={15} className="text-[#91A88F]" />
          <span>Biological Modules:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          {NETWORK_CLUSTERS.map(c => (
            <div key={c.id} className="flex items-center gap-1.5 font-mono text-[11px] text-[#66786C]">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: c.color }} />
              <span className="text-[#193C30] font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GRAPH 1: The Interactive Force-Directed Network Canvas (3D & 2D Modes) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-[#193C30]">
              Graph 1: {networkMode === '3d' ? '3D Molecular Interaction Manifold' : '2D Interactive Force-Directed Topology'}
            </span>
            <span className="badge-demo">Demonstration Subgraph</span>
          </div>

          {/* 3D vs 2D Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E2E8DF] shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setNetworkMode('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                networkMode === '3d'
                  ? 'bg-[#234737] text-white font-bold shadow-xs'
                  : 'text-[#66786C] hover:text-[#193C30]'
              }`}
            >
              <Dna size={12} />
              <span>3D Molecular View</span>
            </button>

            <button
              onClick={() => setNetworkMode('2d')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                networkMode === '2d'
                  ? 'bg-[#234737] text-white font-bold shadow-xs'
                  : 'text-[#66786C] hover:text-[#193C30]'
              }`}
            >
              <Share2 size={12} />
              <span>2D Topology View</span>
            </button>
          </div>
        </div>

        {networkMode === '3d' ? (
          <MolecularNetwork3D onSelectProteinForPrediction={handleSelectProteinForPrediction} />
        ) : (
          <NetworkGraph onSelectProteinForPrediction={handleSelectProteinForPrediction} />
        )}
      </div>

      <BotanicalDivider lineOpacity={0.6} />

      {/* GRAPH 2 & GRAPH 3: Dedicated Scientific PPI Analytics Suite */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#91A88F]" />
              <h2 className="font-heading font-bold text-lg text-[#193C30]">
                Quantitative Interaction Network Analytics
              </h2>
            </div>
            <p className="text-xs text-[#52665A]">
              Empirical interaction confidence brackets and cross-species interactome completeness
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* GRAPH 2: Interaction Confidence Distribution (7 Cols) */}
          <div className="lg:col-span-7">
            <ChartCard
              title="Graph 2: Interaction Confidence Distribution"
              subtitle="Score frequency distribution across curated repository threshold brackets"
              badge="Confidence Histogram"
              source="STRING Database v12.0 Benchmark"
              height="h-68"
              action={
                <div className="flex items-center gap-2">
                  <select
                    value={confidenceOrganism}
                    onChange={(e) => setConfidenceOrganism(e.target.value)}
                    className="bg-[#EEF3EA] border border-[#E2E8DF] rounded-lg px-2 py-1 text-xs text-[#193C30] font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Organisms</option>
                    <option value="human">Homo sapiens</option>
                    <option value="yeast">S. cerevisiae</option>
                  </select>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONFIDENCE_DISTRIBUTIONS[confidenceOrganism]} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="bracket" stroke="#66786C" fontSize={10} tickLine={false} />
                  <YAxis stroke="#66786C" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                    itemStyle={{ color: '#193C30' }}
                    labelStyle={{ color: '#193C30', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" name="Pair Count" fill="#91A88F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Scientific Critical Distinction Alert for Graph 2 */}
            <div className="mt-2.5 p-3.5 rounded-xl bg-[#EEF3EA] border border-[#C69B55]/30 text-xs text-[#52665A] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C69B55] font-semibold">
                <ShieldAlert size={14} />
                <span>Scientific Rigor Demarcation (STRING vs Binding Affinity)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                STRING interaction confidence scores quantify <strong>evidence-based association confidence</strong> (integrated from co-expression, high-throughput assays, text mining, and homology). They do <strong>not</strong> correspond to physical equilibrium dissociation constants ($K_d$) or experimentally measured biochemical binding affinities.
              </p>
            </div>
          </div>

          {/* GRAPH 3: Organism-wise Interaction Analysis (5 Cols) */}
          <div className="lg:col-span-5">
            <ChartCard
              title="Graph 3: Organism-Wise Interaction Analysis"
              subtitle="Curated sample counts vs experimentally verified interaction pairs"
              badge="Cross-Species Comparison"
              source="STRING & BioGRID Composite"
              height="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={ORGANISM_COMPARISON} 
                  layout="vertical"
                  margin={{ top: 10, right: 15, left: 35, bottom: 0 }}
                >
                  <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#66786C" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="organism" stroke="#66786C" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                    itemStyle={{ color: '#193C30' }}
                    labelStyle={{ color: '#193C30', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  <Bar dataKey="samples" name="Curated Samples" fill="#A8B393" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="interactions" name="Verified Interactions" fill="#234737" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
