import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { 
  Binary, 
  Dna, 
  Upload, 
  Trash2, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import LoadingAnimation from '../components/LoadingAnimation';
import ProteinInteractionScene from '../components/3d/ProteinInteractionScene';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import { SAMPLE_PROTEINS, ORGANISMS } from '../data/sampleProteins';
import { SAMPLE_PAIRS } from '../data/samplePredictions';
import { validateSequence } from '../utils/sequenceValidator';
import { readFastaFile } from '../utils/fastaParser';
import { runPredictionPipeline } from '../services/predictionService';

export default function Prediction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useOutletContext() || { addToast: () => {} };

  // Organism Selection
  const [selectedOrganism, setSelectedOrganism] = useState('Homo sapiens');

  // Protein A State
  const [proteinA, setProteinA] = useState({
    id: 'P04637',
    name: 'Cellular tumor antigen p53 (TP53)',
    sequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD'
  });

  // Protein B State
  const [proteinB, setProteinB] = useState({
    id: 'Q00987',
    name: 'E3 ubiquitin-protein ligase Mdm2 (MDM2)',
    sequence: 'MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP'
  });

  // Validation States
  const [validationA, setValidationA] = useState(validateSequence(proteinA.sequence));
  const [validationB, setValidationB] = useState(validateSequence(proteinB.sequence));
  const [globalError, setGlobalError] = useState('');

  // Execution & Loading Pipeline State
  const [isPredicting, setIsPredicting] = useState(false);
  const [stageInfo, setStageInfo] = useState(null);
  const [show3DPreview, setShow3DPreview] = useState(false);

  // Check if routed from sample card
  useEffect(() => {
    if (location.state?.prefillPair) {
      const p = location.state.prefillPair;
      setSelectedOrganism(p.organism);
      setProteinA({
        id: p.proteinA.id,
        name: p.proteinA.name,
        sequence: p.proteinA.sequence
      });
      setProteinB({
        id: p.proteinB.id,
        name: p.proteinB.name,
        sequence: p.proteinB.sequence
      });
      setValidationA(validateSequence(p.proteinA.sequence));
      setValidationB(validateSequence(p.proteinB.sequence));
      if (addToast) addToast({ type: 'info', message: `Loaded: ${p.name}` });
    }
  }, [location.state]);

  const handleSequenceChangeA = (seq) => {
    setProteinA(prev => ({ ...prev, sequence: seq }));
    setValidationA(validateSequence(seq));
    setGlobalError('');
  };

  const handleSequenceChangeB = (seq) => {
    setProteinB(prev => ({ ...prev, sequence: seq }));
    setValidationB(validateSequence(seq));
    setGlobalError('');
  };

  const handleFastaUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await readFastaFile(file);
      if (parsed.length > 0) {
        const first = parsed[0];
        if (target === 'A') {
          setProteinA({
            id: first.id,
            name: first.description || first.id,
            sequence: first.sequence
          });
          setValidationA(validateSequence(first.sequence));
        } else {
          setProteinB({
            id: first.id,
            name: first.description || first.id,
            sequence: first.sequence
          });
          setValidationB(validateSequence(first.sequence));
        }
        if (addToast) addToast({ type: 'success', message: `Parsed FASTA: ${first.id} (${first.sequence.length} AA)` });
      } else {
        setGlobalError('No valid FASTA records found.');
      }
    } catch {
      setGlobalError('Failed to parse uploaded FASTA file.');
    }
  };

  const handleLoadSamplePair = (pair) => {
    setSelectedOrganism(pair.organism);
    setProteinA({
      id: pair.proteinA.id,
      name: pair.proteinA.name,
      sequence: pair.proteinA.sequence
    });
    setProteinB({
      id: pair.proteinB.id,
      name: pair.proteinB.name,
      sequence: pair.proteinB.sequence
    });
    setValidationA(validateSequence(pair.proteinA.sequence));
    setValidationB(validateSequence(pair.proteinB.sequence));
    setGlobalError('');
    if (addToast) addToast({ type: 'info', message: `Loaded: ${pair.name}` });
  };

  const handlePredict = async () => {
    const valA = validateSequence(proteinA.sequence);
    const valB = validateSequence(proteinB.sequence);

    setValidationA(valA);
    setValidationB(valB);

    if (!valA.isValid || !valB.isValid) {
      setGlobalError('Please resolve sequence validation errors before predicting.');
      return;
    }

    if (!proteinA.id.trim() || !proteinB.id.trim()) {
      setGlobalError('Both Protein A and Protein B identifiers must be specified.');
      return;
    }

    setGlobalError('');
    setIsPredicting(true);

    try {
      const result = await runPredictionPipeline(
        proteinA,
        proteinB,
        selectedOrganism,
        (progressInfo) => {
          setStageInfo(progressInfo);
        }
      );

      setTimeout(() => {
        setIsPredicting(false);
        if (addToast) addToast({ type: 'success', message: 'Inference completed successfully!' });
        navigate('/results', { state: { prediction: result } });
      }, 350);

    } catch (err) {
      setIsPredicting(false);
      setGlobalError('Inference pipeline error: ' + err.message);
    }
  };

  return (
    <PageTransition className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">WORKSPACE</span>
            <span className="text-xs font-mono text-[#66786C]">• ESM-2 (650M) + 32-MoE Gating</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Advanced PPI Prediction Workspace
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl">
            Analyze pairwise biological affinities through multimodal sequence embeddings, Gene Ontology term projections, and sparse expert routing.
          </p>
        </div>

        {/* Global Organism Selector */}
        <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-white border border-[#E2E8DF] self-start md:self-auto shadow-card">
          <Dna size={15} className="text-[#6B9B8B]" />
          <span className="text-xs font-mono text-[#66786C]">Organism:</span>
          <select
            value={selectedOrganism}
            onChange={(e) => setSelectedOrganism(e.target.value)}
            className="bg-[#EEF3EA] text-xs font-medium text-[#193C30] px-2.5 py-1 rounded-lg border border-[#E2E8DF] focus:outline-none focus:border-[#91A88F] cursor-pointer"
          >
            {ORGANISMS.map(org => (
              <option key={org.id} value={org.name}>
                {org.commonName} ({org.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Sample Pairs Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8DF] shadow-card">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#193C30]">
            <Sparkles size={13} className="text-[#91A88F]" />
            <span>Curated Benchmark Pairs:</span>
          </div>
          <span className="text-[10px] text-[#66786C] font-mono hidden sm:inline">
            Click any pair to prefill workspace
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_PAIRS.map((pair) => (
            <button
              key={pair.id}
              onClick={() => handleLoadSamplePair(pair)}
              className="p-2.5 rounded-xl bg-[#EEF3EA] hover:bg-[#EAF0E7] border border-[#E2E8DF] text-left transition-all flex flex-col justify-between group"
            >
              <div className="font-semibold text-xs text-[#193C30] truncate group-hover:text-[#234737]">
                {pair.name.split('(')[0]}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#66786C] mt-1">
                <span>{pair.tag}</span>
                <span className="text-[#234737] font-bold">{pair.expectedProbability}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Protein Inputs Grid with Central Molecular Connection */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ================= PROTEIN A CARD ================= */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF] mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] flex items-center justify-center text-[#193C30] font-mono text-xs font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#193C30] text-sm">PROTEIN A</h3>
                    <span className="text-[10px] font-mono text-[#66786C]">First interaction candidate</span>
                  </div>
                </div>

                {/* Sample Picker for A */}
                <div className="flex items-center gap-1.5">
                  <select
                    onChange={(e) => {
                      const found = SAMPLE_PROTEINS.find(p => p.id === e.target.value);
                      if (found) {
                        setProteinA({ id: found.id, name: found.name, sequence: found.sequence });
                        setValidationA(validateSequence(found.sequence));
                      }
                    }}
                    value={proteinA.id}
                    className="bg-[#EEF3EA] text-[11px] font-mono text-[#66786C] px-2 py-1 rounded-lg border border-[#E2E8DF] focus:outline-none focus:border-[#91A88F]"
                  >
                    <option value="" disabled>Load Sample...</option>
                    {SAMPLE_PROTEINS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.geneSymbol || p.id} ({p.length} AA)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setProteinA({ id: '', name: '', sequence: '' });
                      setValidationA(validateSequence(''));
                    }}
                    className="p-1 rounded-md text-[#66786C] hover:text-[#C87575] hover:bg-[#EEF3EA]"
                    title="Clear Protein A"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Identifiers Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#66786C] mb-1">
                    Identifier *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. P04637 or TP53"
                    value={proteinA.id}
                    onChange={(e) => setProteinA(prev => ({ ...prev, id: e.target.value }))}
                    className="scientific-input w-full px-2.5 py-1.5 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#66786C] mb-1">
                    Protein Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cellular tumor antigen p53"
                    value={proteinA.name}
                    onChange={(e) => setProteinA(prev => ({ ...prev, name: e.target.value }))}
                    className="scientific-input w-full px-2.5 py-1.5 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Sequence Input with light botanical background */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase text-[#66786C]">
                    Amino Acid Sequence (IUPAC) *
                  </label>
                  <span className="text-[11px] font-mono text-[#193C30]">
                    {validationA.length} AA
                    {validationA.isTruncated && <span className="text-[#C69B55] ml-1">(trunc. to 1024)</span>}
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={proteinA.sequence}
                  onChange={(e) => handleSequenceChangeA(e.target.value)}
                  placeholder="Paste standard canonical sequence..."
                  className="sequence-input w-full p-2.5 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Validation Feedback */}
              {validationA.errors.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#FAEDED] border border-[#F2D4D4] text-[#C87575] text-xs flex items-start gap-2 mb-3">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px]">
                    {validationA.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                </div>
              )}
              {validationA.warnings?.map((warn, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#FAF4E8] border border-[#EEDFBF] text-[#C69B55] text-xs flex items-center gap-1.5 mb-2.5 text-[11px]">
                  <Info size={13} className="flex-shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>

            {/* Footer: FASTA File Upload & Stats */}
            <div className="pt-3 border-t border-[#E2E8DF] flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF3EA] hover:bg-[#EAF0E7] border border-[#E2E8DF] cursor-pointer text-[#193C30] transition-colors font-mono text-[11px]">
                <Upload size={12} className="text-[#6B9B8B]" />
                <span>Upload FASTA</span>
                <input
                  type="file"
                  accept=".fasta,.fa,.txt"
                  onChange={(e) => handleFastaUpload(e, 'A')}
                  className="hidden"
                />
              </label>

              <span className="font-mono text-[11px] text-[#66786C]">
                Est. MW: <strong className="text-[#193C30]">{validationA.estimatedMwKDa} kDa</strong>
              </span>
            </div>
          </div>

          {/* ================= PROTEIN B CARD ================= */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF] mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E7F2EF] border border-[#CADED8] flex items-center justify-center text-[#234737] font-mono text-xs font-bold">
                    B
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#193C30] text-sm">PROTEIN B</h3>
                    <span className="text-[10px] font-mono text-[#66786C]">Second interaction candidate</span>
                  </div>
                </div>

                {/* Sample Picker for B */}
                <div className="flex items-center gap-1.5">
                  <select
                    onChange={(e) => {
                      const found = SAMPLE_PROTEINS.find(p => p.id === e.target.value);
                      if (found) {
                        setProteinB({ id: found.id, name: found.name, sequence: found.sequence });
                        setValidationB(validateSequence(found.sequence));
                      }
                    }}
                    value={proteinB.id}
                    className="bg-[#EEF3EA] text-[11px] font-mono text-[#66786C] px-2 py-1 rounded-lg border border-[#E2E8DF] focus:outline-none focus:border-[#91A88F]"
                  >
                    <option value="" disabled>Load Sample...</option>
                    {SAMPLE_PROTEINS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.geneSymbol || p.id} ({p.length} AA)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setProteinB({ id: '', name: '', sequence: '' });
                      setValidationB(validateSequence(''));
                    }}
                    className="p-1 rounded-md text-[#66786C] hover:text-[#C87575] hover:bg-[#EEF3EA]"
                    title="Clear Protein B"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Identifiers Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#66786C] mb-1">
                    Identifier *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Q00987 or MDM2"
                    value={proteinB.id}
                    onChange={(e) => setProteinB(prev => ({ ...prev, id: e.target.value }))}
                    className="scientific-input w-full px-2.5 py-1.5 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#66786C] mb-1">
                    Protein Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. E3 ubiquitin-protein ligase Mdm2"
                    value={proteinB.name}
                    onChange={(e) => setProteinB(prev => ({ ...prev, name: e.target.value }))}
                    className="scientific-input w-full px-2.5 py-1.5 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Sequence Input with light botanical background */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase text-[#66786C]">
                    Amino Acid Sequence (IUPAC) *
                  </label>
                  <span className="text-[11px] font-mono text-[#6B9B8B]">
                    {validationB.length} AA
                    {validationB.isTruncated && <span className="text-[#C69B55] ml-1">(trunc. to 1024)</span>}
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={proteinB.sequence}
                  onChange={(e) => handleSequenceChangeB(e.target.value)}
                  placeholder="Paste standard canonical sequence..."
                  className="sequence-input w-full p-2.5 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Validation Feedback */}
              {validationB.errors.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#FAEDED] border border-[#F2D4D4] text-[#C87575] text-xs flex items-start gap-2 mb-3">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px]">
                    {validationB.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                </div>
              )}
              {validationB.warnings?.map((warn, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#FAF4E8] border border-[#EEDFBF] text-[#C69B55] text-xs flex items-center gap-1.5 mb-2.5 text-[11px]">
                  <Info size={13} className="flex-shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>

            {/* Footer: FASTA File Upload & Stats */}
            <div className="pt-3 border-t border-[#E2E8DF] flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF3EA] hover:bg-[#EAF0E7] border border-[#E2E8DF] cursor-pointer text-[#193C30] transition-colors font-mono text-[11px]">
                <Upload size={12} className="text-[#6B9B8B]" />
                <span>Upload FASTA</span>
                <input
                  type="file"
                  accept=".fasta,.fa,.txt"
                  onChange={(e) => handleFastaUpload(e, 'B')}
                  className="hidden"
                />
              </label>

              <span className="font-mono text-[11px] text-[#66786C]">
                Est. MW: <strong className="text-[#193C30]">{validationB.estimatedMwKDa} kDa</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Central Molecular Connection Illustration between Protein A & B */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-20 pointer-events-none items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#91A88F] shadow-card flex items-center justify-center text-[#193C30]">
            <BotanicalLeaf className="w-5 h-5 text-[#234737]" />
          </div>
        </div>
      </div>

      {/* Global Error Banner if any */}
      {globalError && (
        <div className="p-3.5 rounded-xl bg-[#FAEDED] border border-[#F2D4D4] text-[#C87575] text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="font-medium">{globalError}</span>
        </div>
      )}

      {/* Primary Action Section: "Analyze Interaction" */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-col items-center justify-center text-center">
        <h3 className="font-heading font-bold text-base md:text-lg text-[#193C30] mb-1">
          Analyze Interaction Dynamics
        </h3>
        <p className="text-xs text-[#52665A] max-w-lg mb-4">
          Combines ESM-2 (650M) sequence representations with topological Node2Vec Gene Ontology features routed via 32-expert MoE and symmetric Hadamard pair fusion.
        </p>

        <button
          onClick={handlePredict}
          disabled={isPredicting || !validationA.isValid || !validationB.isValid}
          className={`px-8 py-3.5 rounded-xl font-heading font-bold text-sm flex items-center gap-2.5 transition-all shadow-subtle
            ${isPredicting || !validationA.isValid || !validationB.isValid
              ? 'bg-[#EEF3EA] text-[#66786C] cursor-not-allowed'
              : 'bg-[#234737] hover:bg-[#193C30] text-white cursor-pointer active:scale-[0.99]'}
          `}
        >
          <Play size={16} className="fill-current text-[#91A88F]" />
          <span>Analyze Interaction</span>
        </button>

        <span className="mt-2.5 text-[10px] font-mono text-[#718074]">
          Client-Side Simulated Demonstration Workflow (Model Server Decoupled)
        </span>

        {/* Toggle 3D Structural Preview */}
        <div className="mt-4 pt-4 border-t border-[#E2E8DF] w-full flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShow3DPreview(!show3DPreview)}
            className="text-xs font-mono text-[#193C30] hover:text-[#234737] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF3EA] hover:bg-[#EAF0E7] border border-[#E2E8DF] transition-colors shadow-xs"
          >
            <Dna size={13} className="text-[#91A88F]" />
            <span>{show3DPreview ? 'Hide 3D Interaction Complex' : 'Preview 3D Interaction Complex & Binding Contacts'}</span>
          </button>

          {show3DPreview && (
            <div className="w-full mt-4 text-left animate-in fade-in duration-200">
              <ProteinInteractionScene
                proteinA={{ ...proteinA, length: validationA.length || 393 }}
                proteinB={{ ...proteinB, length: validationB.length || 491 }}
                height="h-[420px]"
                confidence={96.2}
              />
            </div>
          )}
        </div>
      </div>

      {/* Multimodal 9-Stage Execution Modal Overlay */}
      {isPredicting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#193C30]/30 backdrop-blur-xs animate-in fade-in duration-150">
          <LoadingAnimation currentStageInfo={stageInfo} />
        </div>
      )}
    </PageTransition>
  );
}
