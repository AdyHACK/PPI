import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Dna, ArrowRight } from 'lucide-react';

export default function ProteinCard({ 
  protein, 
  onSelectForPrediction, 
  onViewDetails,
  compact = false 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopySequence = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(protein.sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFasta = (e) => {
    e.stopPropagation();
    const fastaContent = `>${protein.id} ${protein.geneSymbol || ''} ${protein.name} [${protein.organism}]\n${protein.sequence}\n`;
    const blob = new Blob([fastaContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protein.id}_sequence.fasta`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (compact) {
    return (
      <div 
        onClick={onViewDetails}
        className="scientific-card-interactive p-3.5 cursor-pointer flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B] flex-shrink-0">
            <Dna size={15} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#244A3B]">{protein.id}</span>
              <span className="text-xs font-medium text-[#244A3B] truncate">{protein.geneSymbol}</span>
            </div>
            <p className="text-[11px] text-[#758379] truncate">{protein.name}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 font-mono text-xs text-[#758379]">
          {protein.length} AA
        </div>
      </div>
    );
  }

  return (
    <div className="scientific-card-interactive p-5 flex flex-col justify-between relative group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#EAF0E7] text-[#193C30] border border-[#D1E0CE]">
                {protein.id}
              </span>
              <span className="font-mono text-[11px] text-[#66786C] px-2 py-0.5 rounded-md bg-[#FAF9F3] border border-[#E2E8DF]">
                {protein.organism}
              </span>
            </div>
            <h3 className="font-heading font-bold text-[#193C30] text-sm group-hover:text-[#6B9B8B] transition-colors">
              {protein.geneSymbol ? `${protein.geneSymbol} — ` : ''}{protein.name}
            </h3>
          </div>

          <a 
            href={`https://www.uniprot.org/uniprotkb/${protein.id}/entry`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg border border-[#E2E8DF] text-[#718074] hover:text-[#193C30] hover:bg-[#FAF9F3] transition-colors"
            title="View on UniProt"
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-[#52665A] line-clamp-2 mb-3 leading-relaxed">
          {protein.description || 'Authentic reference protein sequence with curated Gene Ontology annotations.'}
        </p>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] mb-3 text-xs font-mono">
          <div>
            <span className="text-[#718074] text-[10px] block uppercase">Length:</span>
            <span className="text-[#193C30] font-bold">{protein.length} AA</span>
          </div>
          <div>
            <span className="text-[#718074] text-[10px] block uppercase">Mass:</span>
            <span className="text-[#193C30] font-bold">
              {protein.mwKDa ? `${protein.mwKDa} kDa` : '~' + (protein.length * 0.11).toFixed(1) + ' kDa'}
            </span>
          </div>
        </div>

        {/* Gene Ontology Terms Preview */}
        {protein.goAnnotations && (
          <div className="space-y-1 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#718074] block font-semibold">
              Curated GO Annotations:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
              {protein.goAnnotations.bp?.slice(0, 2).map((term, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#EAF0E7] text-[#193C30] border border-[#D1E0CE] truncate max-w-[200px]" title={term.term}>
                  BP: {term.term}
                </span>
              ))}
              {protein.goAnnotations.mf?.slice(0, 1).map((term, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#E7F2EF] text-[#315344] border border-[#CADED8] truncate max-w-[200px]" title={term.term}>
                  MF: {term.term}
                </span>
              ))}
              {protein.goAnnotations.cc?.slice(0, 1).map((term, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#C69B55] border border-[#EEDFBF] truncate max-w-[200px]" title={term.term}>
                  CC: {term.term}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopySequence}
            className="p-1.5 rounded-lg border border-[#E2E8DF] hover:bg-[#FAF9F3] text-[#66786C] hover:text-[#193C30] transition-colors text-xs flex items-center gap-1 font-mono"
            title="Copy Amino Acid Sequence"
          >
            {copied ? <Check size={12} className="text-[#43866B]" /> : <Copy size={12} />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Seq'}</span>
          </button>
          <button
            onClick={handleDownloadFasta}
            className="p-1.5 rounded-lg border border-[#E2E8DF] hover:bg-[#FAF9F3] text-[#66786C] hover:text-[#193C30] transition-colors text-xs flex items-center gap-1 font-mono"
            title="Download FASTA File"
          >
            <Download size={12} />
            <span className="text-[10px]">FASTA</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="text-xs text-[#66786C] hover:text-[#193C30] font-medium transition-colors"
            >
              Details
            </button>
          )}
          {onSelectForPrediction && (
            <button
              onClick={() => onSelectForPrediction(protein)}
              className="px-3 py-1.5 rounded-xl bg-[#234737] text-white hover:bg-[#193C30] text-xs font-semibold flex items-center gap-1 transition-all shadow-subtle active:scale-95"
            >
              <span>Predict</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
