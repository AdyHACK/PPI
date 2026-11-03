import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Dna, Database, Cpu, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { SAMPLE_PROTEINS } from '../data/sampleProteins';
import { DATASETS } from '../data/datasetInfo';

export default function QuickSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredProteins = SAMPLE_PROTEINS.filter(p => 
    p.id.toLowerCase().includes(query.toLowerCase()) ||
    p.geneSymbol?.toLowerCase().includes(query.toLowerCase()) ||
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredDatasets = DATASETS.filter(d =>
    d.id.toLowerCase().includes(query.toLowerCase()) ||
    d.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const pages = [
    { name: 'PPI Prediction Engine', path: '/predict', icon: Sparkles, desc: 'Dual-protein sequence analysis and interaction probability' },
    { name: 'Model Architecture', path: '/architecture', icon: Cpu, desc: 'ESM-2, Node2Vec, 32-MoE, and Siamese symmetric fusion' },
    { name: 'Interaction Network', path: '/network', icon: Share2, desc: 'Interactive biological network visualization with cluster filters' },
    { name: 'Protein Catalog Explorer', path: '/proteins', icon: Dna, desc: 'Browse proteins with full sequence viewers and GO terms' },
    { name: 'Dataset Explorer', path: '/datasets', icon: Database, desc: 'STRING v12.0 and BioGRID datasets with 80/10/10 splits' }
  ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#193C30]/25 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-[#E2E8DF] rounded-2xl shadow-dropdown overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#E2E8DF]">
          <Search size={16} className="text-[#88A58B] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search proteins, datasets, architecture, or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#244A3B] placeholder:text-[#758379] text-xs focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#758379] hover:text-[#244A3B]">
              <X size={14} />
            </button>
          )}
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF9F3] border border-[#E2E8DF] text-[#758379]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2.5 space-y-3">
          {/* Pages */}
          {pages.length > 0 && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#758379] px-2.5 block mb-1">
                Navigation &amp; Features
              </span>
              <div className="space-y-1">
                {pages.map((page, i) => {
                  const Icon = page.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(page.path)}
                      className="p-2 rounded-xl hover:bg-[#FAF9F3] cursor-pointer flex items-center justify-between text-xs group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B]">
                          <Icon size={13} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#244A3B] group-hover:text-[#659A8B] transition-colors text-xs">
                            {page.name}
                          </div>
                          <div className="text-[10px] text-[#758379]">{page.desc}</div>
                        </div>
                      </div>
                      <ArrowRight size={13} className="text-[#758379] group-hover:text-[#244A3B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Proteins */}
          {filteredProteins.length > 0 && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#758379] px-2.5 block mb-1">
                Sample Biological Proteins
              </span>
              <div className="space-y-1">
                {filteredProteins.map((prot) => (
                  <div
                    key={prot.id}
                    onClick={() => handleSelect('/proteins')}
                    className="p-2 rounded-xl hover:bg-[#FAF9F3] cursor-pointer flex items-center justify-between text-xs group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E8F2EF] border border-[#CADED8] flex items-center justify-center text-[#3E6D62] font-mono text-[9px] font-bold">
                        AA
                      </div>
                      <div>
                        <div className="font-semibold text-[#244A3B] flex items-center gap-1.5 text-xs">
                          <span>{prot.geneSymbol || prot.id}</span>
                          <span className="font-mono text-[10px] text-[#758379] font-normal">({prot.id})</span>
                        </div>
                        <div className="text-[10px] text-[#758379] truncate max-w-xs">{prot.name}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#758379]">{prot.length} AA</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {filteredDatasets.length > 0 && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#758379] px-2.5 block mb-1">
                Datasets
              </span>
              <div className="space-y-1">
                {filteredDatasets.map((ds) => (
                  <div
                    key={ds.id}
                    onClick={() => handleSelect('/datasets')}
                    className="p-2 rounded-xl hover:bg-[#FAF9F3] cursor-pointer flex items-center justify-between text-xs group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B]">
                        <Database size={12} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#244A3B] text-xs">
                          {ds.id}
                        </div>
                        <div className="text-[10px] text-[#758379]">{ds.organism} • {ds.threshold}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#758379]">{(ds.totalPairs).toLocaleString()} pairs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pages.length === 0 && filteredProteins.length === 0 && filteredDatasets.length === 0 && (
            <div className="text-center py-6 text-xs text-[#758379]">
              No matching records for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#FAF9F3] border-t border-[#E2E8DF] flex items-center justify-between text-[10px] font-mono text-[#758379]">
          <span>InteractomeX Navigator</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
