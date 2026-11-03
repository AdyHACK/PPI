import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  ExternalLink, 
  GitMerge, 
  Sparkles, 
  FileText,
  Share2,
  Clock,
  Layers,
  Activity,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  CartesianGrid
} from 'recharts';
import PredictionGauge from '../components/PredictionGauge';
import ExportReportModal from '../components/ExportReportModal';
import ProteinInteractionScene from '../components/3d/ProteinInteractionScene';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import { getPredictionHistory } from '../services/predictionService';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const history = getPredictionHistory();

  const [prediction] = useState(() => {
    if (location.state?.prediction) return location.state.prediction;
    if (history.length > 0) return history[0];
    return {
      id: 'demo-sample-01',
      timestamp: new Date().toISOString(),
      proteinA: {
        id: 'P04637',
        name: 'Cellular tumor antigen p53 (TP53)',
        organism: 'Homo sapiens',
        length: 393,
        sequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD'
      },
      proteinB: {
        id: 'Q00987',
        name: 'E3 ubiquitin-protein ligase Mdm2 (MDM2)',
        organism: 'Homo sapiens',
        length: 491,
        sequence: 'MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP'
      },
      organism: 'Homo sapiens',
      probability: 97.4,
      predictedClass: 'Potential Interaction Detected',
      isInteracting: true,
      confidenceTier: 'Very High Confidence',
      selectedExpert: 14,
      rationale: 'Significant multimodal affinity: The N-terminal amphipathic alpha-helix of p53 transactivation domain exhibits high biophysical complementary binding to the hydrophobic surface groove of MDM2, corroborated by coherent Gene Ontology nuclear localization annotations.',
      modalities: {
        sequenceWeight: 0.58,
        ontologyWeight: 0.42,
        sequenceScore: 98,
        ontologyScore: 94
      },
      isSimulated: true
    };
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

  const modalityData = [
    { name: 'ESM-2 (650M) Sequence Representations', score: prediction.modalities?.sequenceScore || 96, fill: '#234737' },
    { name: 'Node2Vec Gene Ontology Graph Embeddings', score: prediction.modalities?.ontologyScore || 92, fill: '#6B9B8B' }
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Top Banner & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/predict')}
            className="p-2 rounded-xl bg-white border border-[#E2E8DF] hover:border-[#91A88F] text-[#66786C] hover:text-[#193C30] transition-colors"
            title="Return to Predict Page"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="badge-sage">ANALYSIS RESULTS</span>
              <span className="text-[10px] font-mono text-[#66786C]">• ID: {prediction.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
              Multimodal Interaction Analysis
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#EEF3EA] border border-[#E2E8DF] hover:border-[#91A88F] text-[#193C30] font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <FileText size={14} className="text-[#6B9B8B]" />
            <span>Export Report (JSON/FASTA/TSV)</span>
          </button>

          <button
            onClick={() => navigate('/predict')}
            className="px-4 py-2 rounded-xl bg-[#234737] hover:bg-[#193C30] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-subtle"
          >
            <RotateCcw size={14} />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Main Results Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Probability Gauge Hero Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#E2E8DF] text-xs font-mono">
            <span className="text-[#66786C] uppercase text-[10px]">Interaction Probability</span>
            <span className="text-[#193C30] font-semibold">{prediction.confidenceTier}</span>
          </div>

          <div className="my-5">
            <PredictionGauge probability={prediction.probability} size={230} />
          </div>

          <div className="w-full p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] text-xs text-left">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[#66786C]">DECISION CLASS:</span>
              <span className={`font-bold ${prediction.isInteracting ? 'text-[#234737]' : 'text-[#C87575]'}`}>
                {prediction.predictedClass}
              </span>
            </div>
            <p className="text-[11px] text-[#52665A] leading-relaxed">
              Calibrated against the high-confidence threshold (≥0.80) with 1:1 balanced negative control pairing.
            </p>
          </div>
        </div>

        {/* Protein Pair Profiles & Interaction Diagram (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
            <div className="flex items-center gap-2 font-heading font-bold text-[#193C30] text-sm md:text-base">
              <GitMerge size={17} className="text-[#234737]" />
              <span>Target Protein Pair Profiles</span>
            </div>
            <span className="text-xs font-mono text-[#66786C]">
              Organism: <strong className="text-[#193C30]">{prediction.organism}</strong>
            </span>
          </div>

          {/* Dual Protein Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Protein A Card */}
            <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EAF0E7] text-[#193C30] border border-[#CCD6CA]">
                  {prediction.proteinA.id}
                </span>
                <span className="font-mono text-[10px] text-[#66786C]">{prediction.proteinA.length} AA</span>
              </div>
              <h4 className="font-heading font-bold text-xs text-[#193C30] truncate">
                {prediction.proteinA.name || prediction.proteinA.id}
              </h4>
              <p className="text-[10px] text-[#66786C] font-mono truncate">
                Target: Protein Partner A
              </p>
              <button
                onClick={() => navigate('/proteins')}
                className="text-[11px] text-[#234737] hover:underline font-medium pt-0.5 flex items-center gap-1"
              >
                <span>View in Protein Explorer</span>
                <ExternalLink size={10} />
              </button>
            </div>

            {/* Protein B Card */}
            <div className="p-3.5 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#E7F2EF] text-[#234737] border border-[#CADED8]">
                  {prediction.proteinB.id}
                </span>
                <span className="font-mono text-[10px] text-[#66786C]">{prediction.proteinB.length} AA</span>
              </div>
              <h4 className="font-heading font-bold text-xs text-[#193C30] truncate">
                {prediction.proteinB.name || prediction.proteinB.id}
              </h4>
              <p className="text-[10px] text-[#66786C] font-mono truncate">
                Target: Protein Partner B
              </p>
              <button
                onClick={() => navigate('/proteins')}
                className="text-[11px] text-[#6B9B8B] hover:underline font-medium pt-0.5 flex items-center gap-1"
              >
                <span>View in Protein Explorer</span>
                <ExternalLink size={10} />
              </button>
            </div>
          </div>

          {/* Minimalist Interaction Relationship Bridge */}
          <div className="p-4 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] flex items-center justify-around py-5">
            {/* Visual Node A */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#234737] flex items-center justify-center font-mono font-bold text-[#193C30] text-xs shadow-subtle">
                {prediction.proteinA.id.slice(0, 4)}
              </div>
              <span className="text-[10px] font-mono text-[#193C30] mt-1 font-semibold">Protein A</span>
            </div>

            {/* Bridge */}
            <div className="flex-1 max-w-[190px] flex flex-col items-center px-3">
              <span className={`text-[10px] font-mono font-bold ${prediction.isInteracting ? 'text-[#234737]' : 'text-[#C87575]'}`}>
                {prediction.isInteracting ? 'Physical Interaction' : 'No Binding Detected'}
              </span>
              <div className="w-full h-1.5 bg-[#E2E8DF] rounded-full overflow-hidden my-1.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500
                    ${prediction.isInteracting ? 'bg-[#234737]' : 'bg-[#C87575]'}
                  `}
                  style={{ width: `${prediction.probability}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-[#66786C]">Symmetric Hadamard Fusion: Z = X_A ⊙ X_B</span>
            </div>

            {/* Visual Node B */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#6B9B8B] flex items-center justify-center font-mono font-bold text-[#6B9B8B] text-xs shadow-subtle">
                {prediction.proteinB.id.slice(0, 4)}
              </div>
              <span className="text-[10px] font-mono text-[#193C30] mt-1 font-semibold">Protein B</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Interactive Molecular Interaction Complex */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-[#193C30]">
              3D Interactive Molecular Complex &amp; Binding Pose
            </span>
            <span className="badge-demo">Predicted Complex Geometry</span>
          </div>
          <span className="text-[11px] font-mono text-[#66786C]">Orbit • Zoom • Inspect Binding Contacts</span>
        </div>

        <ProteinInteractionScene
          proteinA={prediction.proteinA}
          proteinB={prediction.proteinB}
          confidence={prediction.probability}
          isInteracting={prediction.isInteracting}
          height="h-[440px]"
        />
      </div>

      {/* Multimodal Feature Attribution & Scientific Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Modality Contribution Bars (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="font-heading font-bold text-[#193C30] text-sm">
                  Modality Feature Attribution
                </h3>
                <p className="text-xs text-[#52665A]">
                  Relative contribution across Sequence (ESM-2) and Ontology (Node2Vec) channels
                </p>
              </div>
              <span className="badge-sage">Weights</span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modalityData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#66786C" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {modalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#EEF3EA] border border-[#E2E8DF]">
                <span className="text-[#66786C]">ESM-2 (650M) Sequence Weight:</span>
                <span className="text-[#193C30] font-bold">58.0%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#EEF3EA] border border-[#E2E8DF]">
                <span className="text-[#66786C]">Node2Vec GO Topology Weight:</span>
                <span className="text-[#6B9B8B] font-bold">42.0%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8DF] mt-3.5 text-[11px] font-mono text-[#66786C] flex items-center justify-between">
            <span>MoE Routing Selection:</span>
            <span className="text-[#234737] font-bold">Expert #{prediction.selectedExpert} of 32 Routed</span>
          </div>
        </div>

        {/* Scientific Interpretation (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={16} className="text-[#91A88F]" />
              <h3 className="font-heading font-bold text-[#193C30] text-sm">
                Biological Result Interpretation
              </h3>
            </div>

            <div className="space-y-2.5 text-xs leading-relaxed text-[#52665A]">
              <p>
                <strong className="text-[#193C30]">Predicted Outcome:</strong> {prediction.rationale}
              </p>
              <p>
                <strong className="text-[#193C30]">Sequence Modality:</strong> ESM-2 representations capture high-dimensional residue patterns and electrostatic complementarity without requiring solved 3D structures.
              </p>
              <p>
                <strong className="text-[#6B9B8B]">Gene Ontology:</strong> Node2Vec topological walks over Biological Process and Cellular Component DAG subgraphs ensure the proteins share compatible cellular compartments.
              </p>
              <p>
                <strong className="text-[#234737]">Multimodal Integration:</strong> Combining both signals via Siamese symmetric Hadamard fusion ($Z = X_A \odot X_B$) markedly suppresses false-positive rates.
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3.5 border-t border-[#E2E8DF] mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link to="/network" className="text-[#234737] hover:underline font-semibold flex items-center gap-1">
              <Share2 size={13} />
              <span>Explore in Interaction Network</span>
            </Link>
            <Link to="/" className="text-[#66786C] hover:text-[#193C30]">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        prediction={prediction}
      />
    </PageTransition>
  );
}
