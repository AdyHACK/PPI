import React, { useState } from 'react';
import { X, Printer, Download, FileText, ShieldAlert, Copy, Check } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, prediction }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  if (!isOpen || !prediction) return null;

  const handlePrint = () => {
    window.print();
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', url);
    dlAnchorElem.setAttribute('download', filename);
    dlAnchorElem.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(prediction, null, 2);
    downloadFile(dataStr, `InteractomeX_Report_${prediction.proteinA.id}_${prediction.proteinB.id}.json`, 'application/json');
  };

  const handleDownloadFASTA = () => {
    const fastaContent = `>${prediction.proteinA.id} | ${prediction.proteinA.name || 'Protein A'} | ${prediction.organism}\n${prediction.proteinA.sequence}\n\n>${prediction.proteinB.id} | ${prediction.proteinB.name || 'Protein B'} | ${prediction.organism}\n${prediction.proteinB.sequence}\n`;
    downloadFile(fastaContent, `InteractomeX_Pair_${prediction.proteinA.id}_${prediction.proteinB.id}.fasta`, 'text/plain');
  };

  const handleDownloadTSV = () => {
    const tsvContent = [
      'Report_ID\tTimestamp\tProteinA_ID\tProteinA_Name\tProteinA_Length\tProteinB_ID\tProteinB_Name\tProteinB_Length\tOrganism\tProbability\tPredicted_Class\tIs_Interacting\tConfidence_Tier\tMoE_Expert\tExecution_Status',
      `${prediction.id}\t${prediction.timestamp}\t${prediction.proteinA.id}\t"${prediction.proteinA.name}"\t${prediction.proteinA.length}\t${prediction.proteinB.id}\t"${prediction.proteinB.name}"\t${prediction.proteinB.length}\t${prediction.organism}\t${prediction.probability.toFixed(1)}\t"${prediction.predictedClass}"\t${prediction.isInteracting}\t"${prediction.confidenceTier}"\t${prediction.selectedExpert}\t"${prediction.isSimulated ? 'Simulated Frontend Demo' : 'Production Model'}"`
    ].join('\n');
    downloadFile(tsvContent, `InteractomeX_Summary_${prediction.proteinA.id}_${prediction.proteinB.id}.tsv`, 'text/tab-separated-values');
  };

  const handleCopyMarkdown = () => {
    const md = `# InteractomeX Prediction Report: ${prediction.proteinA.id} × ${prediction.proteinB.id}
- **Timestamp**: ${new Date(prediction.timestamp).toLocaleString()}
- **Target Organism**: ${prediction.organism}
- **Interaction Probability**: ${prediction.probability.toFixed(1)}% (${prediction.confidenceTier})
- **Classification**: ${prediction.predictedClass}
- **Selected Sparse MoE**: Expert #${prediction.selectedExpert} of 32
- **Execution Status**: ${prediction.isSimulated ? 'Simulated Demonstration Engine' : 'Production Model'}

## Target Protein A
- **ID**: ${prediction.proteinA.id} (${prediction.proteinA.name})
- **Length**: ${prediction.proteinA.length} AA
\`\`\`fasta
>${prediction.proteinA.id}
${prediction.proteinA.sequence}
\`\`\`

## Target Protein B
- **ID**: ${prediction.proteinB.id} (${prediction.proteinB.name})
- **Length**: ${prediction.proteinB.length} AA
\`\`\`fasta
>${prediction.proteinB.id}
${prediction.proteinB.sequence}
\`\`\`

## Biological Interpretation
${prediction.rationale}
`;
    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#193C30]/25 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8DF] rounded-2xl shadow-dropdown overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8DF] bg-[#FAF9F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B]">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                InteractomeX Scientific Analysis Dossier
              </h3>
              <span className="text-[10px] font-mono text-[#758379]">
                ID: {prediction.id} • {new Date(prediction.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-[#FAF9F3] text-[#244A3B] border border-[#E2E8DF] text-xs flex items-center gap-1.5 transition-colors font-medium"
              title="Print / Save PDF"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-[#FAF9F3] text-[#244A3B] border border-[#E2E8DF] text-xs flex items-center gap-1.5 transition-colors font-medium"
              title="Export JSON"
            >
              <Download size={13} />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={handleDownloadFASTA}
              className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-[#FAF9F3] text-[#244A3B] border border-[#E2E8DF] text-xs flex items-center gap-1.5 transition-colors font-medium"
              title="Export FASTA"
            >
              <Download size={13} />
              <span className="hidden sm:inline">FASTA</span>
            </button>
            <button
              onClick={handleDownloadTSV}
              className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-[#FAF9F3] text-[#244A3B] border border-[#E2E8DF] text-xs flex items-center gap-1.5 transition-colors font-medium"
              title="Export TSV Table"
            >
              <Download size={13} />
              <span className="hidden sm:inline">TSV</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-[#FAF9F3] text-[#244A3B] border border-[#E2E8DF] text-xs flex items-center gap-1.5 transition-colors font-medium"
              title="Copy Markdown"
            >
              {copiedFormat === 'md' ? <Check size={13} className="text-[#43866B]" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copiedFormat === 'md' ? 'Copied' : 'MD'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#758379] hover:text-[#244A3B] ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#244A3B] leading-relaxed">
          {/* Executive Summary Box */}
          <div className="p-4 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] text-[#758379] uppercase tracking-wider block">
                Target Protein Pair
              </span>
              <h4 className="text-base font-heading font-bold text-[#244A3B] mt-0.5">
                {prediction.proteinA.name || prediction.proteinA.id} <span className="text-[#659A8B]">×</span> {prediction.proteinB.name || prediction.proteinB.id}
              </h4>
              <p className="text-xs text-[#758379] mt-0.5">
                Target Organism: <strong className="text-[#244A3B]">{prediction.organism}</strong>
              </p>
            </div>

            <div className="text-center sm:text-right flex-shrink-0">
              <span className="font-mono text-[9px] text-[#758379] uppercase tracking-wider block">
                Probability
              </span>
              <span className="text-2xl font-heading font-extrabold text-[#244A3B]">
                {prediction.probability.toFixed(1)}%
              </span>
              <span className={`block text-[10px] font-mono font-semibold mt-0.5
                ${prediction.isInteracting ? 'text-[#43866B]' : 'text-[#C87575]'}
              `}>
                {prediction.predictedClass}
              </span>
            </div>
          </div>

          {/* Biological Interpretation */}
          <div className="p-3.5 rounded-xl border border-[#E2E8DF] space-y-1">
            <h5 className="font-heading font-bold text-[#244A3B] text-xs">
              Biological Rationale &amp; Interpretation
            </h5>
            <p className="text-[#758379] text-xs leading-relaxed">
              {prediction.rationale}
            </p>
          </div>

          {/* Protein Sequence Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-[#E2E8DF]">
              <span className="font-mono text-[10px] text-[#244A3B] font-bold uppercase tracking-wider block mb-1">
                Protein A: {prediction.proteinA.id}
              </span>
              <div className="space-y-0.5 font-mono text-[10px] text-[#758379]">
                <div>Length: {prediction.proteinA.length} Amino Acids</div>
                <div>Organism: {prediction.proteinA.organism}</div>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono text-[#758379] block mb-0.5">Sequence (N-terminal snippet):</span>
                <div className="p-2 rounded bg-[#F3F6F1] font-mono text-[10px] text-[#244A3B] break-all border border-[#E2E8DF]">
                  {prediction.proteinA.sequence.substring(0, 80)}...
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E8DF]">
              <span className="font-mono text-[10px] text-[#659A8B] font-bold uppercase tracking-wider block mb-1">
                Protein B: {prediction.proteinB.id}
              </span>
              <div className="space-y-0.5 font-mono text-[10px] text-[#758379]">
                <div>Length: {prediction.proteinB.length} Amino Acids</div>
                <div>Organism: {prediction.proteinB.organism}</div>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono text-[#758379] block mb-0.5">Sequence (N-terminal snippet):</span>
                <div className="p-2 rounded bg-[#F3F6F1] font-mono text-[10px] text-[#244A3B] break-all border border-[#E2E8DF]">
                  {prediction.proteinB.sequence.substring(0, 80)}...
                </div>
              </div>
            </div>
          </div>

          {/* Multimodal Architecture Metadata */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] font-mono text-[10px] space-y-1.5">
            <h5 className="font-heading font-semibold text-[#244A3B] text-xs uppercase tracking-wider">
              Multimodal Inference Specification
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#758379] pt-1">
              <div>
                <span className="block text-[9px]">Sequence PLM:</span>
                <span className="text-[#244A3B] font-semibold">ESM-2 (650M)</span>
              </div>
              <div>
                <span className="block text-[9px]">Ontology Graph:</span>
                <span className="text-[#244A3B] font-semibold">Node2Vec (64d)</span>
              </div>
              <div>
                <span className="block text-[9px]">MoE Expert:</span>
                <span className="text-[#43866B] font-semibold">Expert #{prediction.selectedExpert} of 32</span>
              </div>
              <div>
                <span className="block text-[9px]">Pair Fusion:</span>
                <span className="text-[#244A3B] font-semibold">Z = X_A ⊙ X_B</span>
              </div>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FAF4E8] border border-[#EEDFBF] text-[#C69B55] text-[11px]">
            <ShieldAlert size={15} className="flex-shrink-0 mt-0.5" />
            <p>
              <strong>Academic Demonstration Notice:</strong> This prediction was generated using the InteractomeX simulated demonstration engine. In production deployments, results are computed by real ESM-2 and PyTorch Sparse MoE checkpoints.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#FAF9F3] border-t border-[#E2E8DF] flex items-center justify-between text-xs text-[#758379]">
          <span>InteractomeX Research Platform</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#244A3B] text-white hover:bg-[#193C30] text-xs font-semibold"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
