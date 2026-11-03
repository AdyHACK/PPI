import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Play, 
  X,
  BarChart2,
  Dna,
  Layers,
  Palette
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import ProteinCard from '../components/ProteinCard';
import ChartCard from '../components/ChartCard';
import PageTransition from '../components/motion/PageTransition';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';
import Protein3DViewer from '../components/3d/Protein3DViewer';
import { SAMPLE_PROTEINS, ORGANISMS } from '../data/sampleProteins';

// Amino Acid Biochemical Properties for Color-Coding
const AA_CATEGORIES = {
  // Hydrophobic / Non-polar
  A: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  V: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  L: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  I: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  P: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  F: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  M: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },
  W: { category: 'Hydrophobic', bg: 'bg-[#EEF4ED]', text: 'text-[#244A3B]', border: 'border-[#D1E0CE]' },

  // Polar / Uncharged
  G: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  S: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  T: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  C: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  Y: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  N: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },
  Q: { category: 'Polar', bg: 'bg-[#E8F2EF]', text: 'text-[#3E6D62]', border: 'border-[#CADED8]' },

  // Acidic / Negatively Charged
  D: { category: 'Acidic (-)', bg: 'bg-[#FAEDED]', text: 'text-[#C87575]', border: 'border-[#F2D4D4]' },
  E: { category: 'Acidic (-)', bg: 'bg-[#FAEDED]', text: 'text-[#C87575]', border: 'border-[#F2D4D4]' },

  // Basic / Positively Charged
  K: { category: 'Basic (+)', bg: 'bg-[#F4F6EE]', text: 'text-[#55633E]', border: 'border-[#DEE4CF]' },
  R: { category: 'Basic (+)', bg: 'bg-[#F4F6EE]', text: 'text-[#55633E]', border: 'border-[#DEE4CF]' },
  H: { category: 'Basic (+)', bg: 'bg-[#F4F6EE]', text: 'text-[#55633E]', border: 'border-[#DEE4CF]' }
};

export default function ProteinExplorer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState('all');
  const [inspectingProtein, setInspectingProtein] = useState(SAMPLE_PROTEINS[0]);
  const [inspectorTab, setInspectorTab] = useState('3d'); // '3d' | 'residues'
  const [copied, setCopied] = useState(false);
  const [showColorCodedResidues, setShowColorCodedResidues] = useState(true);

  // Filtered list
  const filteredProteins = useMemo(() => {
    return SAMPLE_PROTEINS.filter(p => {
      const matchesOrg = selectedOrganism === 'all' || p.organism === selectedOrganism;
      const matchesSearch = searchQuery === '' ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.geneSymbol?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOrg && matchesSearch;
    });
  }, [searchQuery, selectedOrganism]);

  // Graph 6: Sequence Length Distribution & Summary Statistics
  const sequenceStats = useMemo(() => {
    const lengths = SAMPLE_PROTEINS.map(p => p.length);
    const min = Math.min(...lengths);
    const max = Math.max(...lengths);
    const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);

    const bins = [
      { range: '< 200 AA', count: SAMPLE_PROTEINS.filter(p => p.length < 200).length },
      { range: '200–400 AA', count: SAMPLE_PROTEINS.filter(p => p.length >= 200 && p.length < 400).length },
      { range: '400–600 AA', count: SAMPLE_PROTEINS.filter(p => p.length >= 400 && p.length < 600).length },
      { range: '600–1000 AA', count: SAMPLE_PROTEINS.filter(p => p.length >= 600 && p.length < 1000).length },
      { range: '≥ 1000 AA', count: SAMPLE_PROTEINS.filter(p => p.length >= 1000).length }
    ];

    return { min, max, avg, bins };
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFasta = (protein) => {
    const fasta = `>${protein.id} ${protein.geneSymbol || ''} ${protein.name} [${protein.organism}]\n${protein.sequence}\n`;
    const blob = new Blob([fasta], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protein.id}.fasta`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLaunchPrediction = (protein) => {
    navigate('/predict', {
      state: {
        prefillPair: {
          name: `${protein.geneSymbol || protein.id} Analysis`,
          organism: protein.organism,
          proteinA: protein,
          proteinB: SAMPLE_PROTEINS.find(p => p.id !== protein.id && p.organism === protein.organism) || SAMPLE_PROTEINS[1]
        }
      }
    });
  };

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-sage">PROTEIN BIOINFORMATICS WORKSPACE</span>
            <span className="text-xs font-mono text-[#66786C]">• 4 Model Organisms</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#193C30] tracking-tight">
            Protein Catalog &amp; Sequence Explorer
          </h1>
          <p className="text-xs md:text-sm text-[#52665A] mt-0.5 max-w-2xl">
            Inspect canonical protein sequences, physical molecular mass properties, residue categories, and Gene Ontology annotations.
          </p>
        </div>

        <div className="flex items-center gap-3 p-2 px-3.5 rounded-xl bg-white border border-[#E2E8DF] text-xs font-mono text-[#66786C] shadow-card">
          <span>Entries: <strong className="text-[#193C30]">{SAMPLE_PROTEINS.length}</strong></span>
          <span className="h-4 w-px bg-[#E2E8DF]" />
          <span>Avg Length: <strong className="text-[#193C30]">{sequenceStats.avg} AA</strong></span>
        </div>
      </div>

      {/* GRAPH 6: Protein Sequence Analysis Statistics & Distribution Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8DF]">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-[#91A88F]" />
              <h3 className="font-heading font-bold text-sm text-[#193C30]">
                Graph 6: Protein Sequence Length Analysis &amp; Distribution
              </h3>
              <span className="badge-demo">Repository Metrics</span>
            </div>
            <p className="text-xs text-[#52665A] mt-0.5">
              Empirical residue count frequency and architectural bounds across curated model organisms
            </p>
          </div>

          {/* Metric Stats Pills */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#EEF3EA] border border-[#E2E8DF] text-[#66786C]">
              Min: <strong className="text-[#193C30]">{sequenceStats.min} AA</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#EEF3EA] border border-[#E2E8DF] text-[#66786C]">
              Max: <strong className="text-[#193C30]">{sequenceStats.max} AA</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#EAF0E7] border border-[#CCD6CA] text-[#193C30] font-semibold">
              Avg: {sequenceStats.avg} AA
            </span>
          </div>
        </div>

        {/* Distribution Histogram */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sequenceStats.bins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" stroke="#66786C" fontSize={11} tickLine={false} />
              <YAxis stroke="#66786C" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8DF', borderRadius: '8px', fontSize: '11px', color: '#193C30', boxShadow: '0 2px 8px rgba(35, 71, 55, 0.08)' }}
                itemStyle={{ color: '#193C30' }}
                labelStyle={{ color: '#193C30', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" name="Proteins" fill="#91A88F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DF] shadow-card flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#758379]" />
          <input
            type="text"
            placeholder="Search by UniProt ID, gene name (e.g. TP53, CDK2, EGFR)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="scientific-input w-full pl-9 pr-3 py-1.5 rounded-xl text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-[#758379] hover:text-[#244A3B]">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Organism Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedOrganism('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              selectedOrganism === 'all' 
                ? 'bg-[#244A3B] text-white font-bold' 
                : 'bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B]'
            }`}
          >
            All Species
          </button>
          {ORGANISMS.map(org => (
            <button
              key={org.id}
              onClick={() => setSelectedOrganism(org.name)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                selectedOrganism === org.name 
                  ? 'bg-[#244A3B] text-white font-bold' 
                  : 'bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B]'
              }`}
            >
              <span>{org.commonName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Protein Cards Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredProteins.map((protein) => (
              <ProteinCard
                key={protein.id}
                protein={protein}
                onSelectForPrediction={() => handleLaunchPrediction(protein)}
                onViewDetails={() => setInspectingProtein(protein)}
              />
            ))}
          </div>

          {filteredProteins.length === 0 && (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#E2E8DF] text-xs text-[#758379] space-y-2">
              <p>No proteins matched your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedOrganism('all'); }}
                className="text-[#244A3B] hover:underline font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Detailed Inspector Panel (5 Cols) */}
        <div className="lg:col-span-5">
          {inspectingProtein ? (
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-card sticky top-20 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8DF]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EEF4ED] text-[#244A3B] border border-[#D1E0CE]">
                      {inspectingProtein.id}
                    </span>
                    <span className="text-[11px] font-mono text-[#758379]">{inspectingProtein.organism}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#244A3B]">
                    {inspectingProtein.geneSymbol ? `${inspectingProtein.geneSymbol} — ` : ''}{inspectingProtein.name}
                  </h3>
                </div>

                <a
                  href={`https://www.uniprot.org/uniprotkb/${inspectingProtein.id}/entry`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-[#E2E8DF] text-[#758379] hover:text-[#244A3B] transition-colors"
                  title="UniProt KB Entry"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Inspection Mode Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                <button
                  onClick={() => setInspectorTab('3d')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
                    inspectorTab === '3d'
                      ? 'bg-[#244A3B] text-white font-bold shadow-xs'
                      : 'text-[#758379] hover:text-[#244A3B]'
                  }`}
                >
                  <Dna size={12} />
                  <span>3D Structure Viewer</span>
                </button>
                <button
                  onClick={() => setInspectorTab('residues')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
                    inspectorTab === 'residues'
                      ? 'bg-[#244A3B] text-white font-bold shadow-xs'
                      : 'text-[#758379] hover:text-[#244A3B]'
                  }`}
                >
                  <Palette size={12} />
                  <span>Residues &amp; FASTA</span>
                </button>
              </div>

              {/* 3D Structure Viewer Container */}
              {inspectorTab === '3d' && (
                <div className="space-y-2">
                  <Protein3DViewer protein={inspectingProtein} height="h-[320px]" />
                </div>
              )}

              {/* Physical Properties */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                  <span className="text-[#758379] text-[10px] block uppercase">Sequence Length</span>
                  <span className="text-[#244A3B] font-bold text-sm">{inspectingProtein.length} AA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                  <span className="text-[#758379] text-[10px] block uppercase">Molecular Mass</span>
                  <span className="text-[#43866B] font-bold text-sm">
                    {inspectingProtein.mwKDa ? `${inspectingProtein.mwKDa} kDa` : '~' + (inspectingProtein.length * 0.11).toFixed(1) + ' kDa'}
                  </span>
                </div>
              </div>

              {/* Gene Ontology Annotations Breakdown */}
              {inspectingProtein.goAnnotations && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#758379] block font-semibold">
                    Gene Ontology Annotations (GO DAG)
                  </span>

                  {/* Biological Process */}
                  <div>
                    <span className="text-[10px] font-mono text-[#244A3B] font-semibold block mb-1">
                      ● Biological Process (BP)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {inspectingProtein.goAnnotations.bp?.map((term, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#EEF4ED] text-[#244A3B] border border-[#D1E0CE]" title={`Evidence: ${term.evidence}`}>
                          {term.term} <span className="font-mono text-[9px] text-[#758379]">({term.id})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Molecular Function */}
                  <div>
                    <span className="text-[10px] font-mono text-[#659A8B] font-semibold block mb-1">
                      ● Molecular Function (MF)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {inspectingProtein.goAnnotations.mf?.map((term, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F2EF] text-[#3E6D62] border border-[#CADED8]" title={`Evidence: ${term.evidence}`}>
                          {term.term} <span className="font-mono text-[9px] text-[#758379]">({term.id})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cellular Component */}
                  <div>
                    <span className="text-[10px] font-mono text-[#C69B55] font-semibold block mb-1">
                      ● Cellular Component (CC)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {inspectingProtein.goAnnotations.cc?.map((term, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#C69B55] border border-[#EEDFBF]" title={`Evidence: ${term.evidence}`}>
                          {term.term} <span className="font-mono text-[9px] text-[#758379]">({term.id})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Color-Coded Amino Acid Sequence Viewer with Interactive Legend */}
              {inspectorTab === 'residues' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#758379] font-semibold">
                        Residue Visualization
                      </span>
                      <button
                        onClick={() => setShowColorCodedResidues(!showColorCodedResidues)}
                        className="text-[10px] font-mono text-[#659A8B] hover:underline flex items-center gap-1"
                      >
                        <Palette size={11} />
                        <span>{showColorCodedResidues ? 'Plain' : 'Color Coded'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(inspectingProtein.sequence)}
                        className="px-2 py-0.5 rounded-md bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] text-[10px] font-mono text-[#244A3B] flex items-center gap-1"
                      >
                        {copied ? <Check size={11} className="text-[#43866B]" /> : <Copy size={11} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadFasta(inspectingProtein)}
                        className="px-2 py-0.5 rounded-md bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] text-[10px] font-mono text-[#244A3B] flex items-center gap-1"
                      >
                        <Download size={11} />
                        <span>FASTA</span>
                      </button>
                    </div>
                  </div>

                  {/* Residue Category Legend */}
                  {showColorCodedResidues && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] text-[9px] font-mono mb-2">
                      <div className="flex items-center gap-1 text-[#244A3B]">
                        <span className="w-2.5 h-2.5 rounded bg-[#EEF4ED] border border-[#D1E0CE]" />
                        <span>Hydrophobic</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#3E6D62]">
                        <span className="w-2.5 h-2.5 rounded bg-[#E8F2EF] border border-[#CADED8]" />
                        <span>Polar</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#C87575]">
                        <span className="w-2.5 h-2.5 rounded bg-[#FAEDED] border border-[#F2D4D4]" />
                        <span>Acidic (-)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#55633E]">
                        <span className="w-2.5 h-2.5 rounded bg-[#F4F6EE] border border-[#DEE4CF]" />
                        <span>Basic (+)</span>
                      </div>
                    </div>
                  )}

                  {/* Sequence Rendering */}
                  {showColorCodedResidues ? (
                    <div className="p-2.5 rounded-xl bg-[#F3F6F1] border border-[#E2E8DF] max-h-40 overflow-y-auto flex flex-wrap gap-0.5 text-[10px] font-mono select-all">
                      {inspectingProtein.sequence.split('').map((char, idx) => {
                        const style = AA_CATEGORIES[char] || { bg: 'bg-white', text: 'text-[#193C30]', border: 'border-transparent' };
                        return (
                          <span 
                            key={idx} 
                            className={`w-4 h-4.5 rounded-xs flex items-center justify-center font-bold border ${style.bg} ${style.text} ${style.border}`}
                            title={`${char} (#${idx + 1}): ${style.category || 'Residue'}`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#EEF3EA] border border-[#E2E8DF] max-h-36 overflow-y-auto text-[10px] sequence-mono text-[#193C30] leading-relaxed select-all">
                      {inspectingProtein.sequence}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleLaunchPrediction(inspectingProtein)}
                className="w-full py-2.5 rounded-xl bg-[#234737] hover:bg-[#193C30] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-subtle cursor-pointer"
              >
                <Play size={13} className="fill-current text-[#91A88F]" />
                <span>Test Interaction in Prediction</span>
              </button>
            </div>
          ) : (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#E2E8DF] text-xs text-[#66786C]">
              Select any protein card to inspect sequence and annotations.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
