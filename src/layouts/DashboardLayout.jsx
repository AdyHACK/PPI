import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import QuickSearchModal from '../components/QuickSearchModal';
import NotificationCenter from '../components/NotificationCenter';
import Toast from '../components/Toast';
import { BookOpen, X, ArrowRight } from 'lucide-react';
import { BotanicalLeaf, BotanicalDivider } from '../components/BotanicalElements';

export default function DashboardLayout({ toasts, addToast, dismissToast }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('interactomex_sidebar_collapsed') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('interactomex_sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#F5F7F1] text-[#52665A] flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenDocs={() => setIsDocsOpen(true)}
          unreadCount={2}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ addToast }} />
        </main>
      </div>

      {/* Modals & Overlays */}
      <QuickSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Quick Documentation Reference Modal */}
      {isDocsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#193C30]/25 backdrop-blur-xs" onClick={() => setIsDocsOpen(false)} />
          <div className="relative w-full max-w-xl bg-white border border-[#E2E8DF] rounded-2xl p-6 shadow-dropdown z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8DF] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-[#244A3B]">
                  <BookOpen size={15} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#244A3B] text-sm">InteractomeX Quick Guide</h3>
                  <span className="text-[10px] font-mono text-[#758379]">Multimodal Deep Learning Architecture Overview</span>
                </div>
              </div>
              <button onClick={() => setIsDocsOpen(false)} className="p-1 rounded-md text-[#758379] hover:text-[#244A3B]">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-[#758379] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                <h4 className="font-heading font-bold text-[#244A3B] mb-1 text-xs">Recommended Walkthrough Flow</h4>
                <p>
                  Start at <strong className="text-[#244A3B]">Dashboard</strong> → Proceed to <strong className="text-[#244A3B]">PPI Prediction</strong> → Load a benchmark pair (e.g. TP53 + MDM2) → Click <strong className="text-[#244A3B]">Analyze Interaction</strong> to observe the 9-stage pipeline → View the rich <strong className="text-[#244A3B]">Results</strong> → Explore the <strong className="text-[#244A3B]">Model Architecture</strong>, <strong className="text-[#244A3B]">Interaction Network</strong>, and <strong className="text-[#244A3B]">Dataset Explorer</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#244A3B] mb-0.5 text-xs">Dual Biological Modalities</h4>
                <p>
                  <strong className="text-[#244A3B]">1. Sequence Modality:</strong> Uses ESM-2 (650M) protein language models to extract evolutionary and structural residue representations, projected into 20×64 tensors.
                </p>
                <p className="mt-1">
                  <strong className="text-[#659A8B]">2. Functional Modality:</strong> Uses Node2Vec biased random walks over Gene Ontology DAG networks to capture functional and compartmental localization context.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#244A3B] mb-0.5 text-xs">Sparse Mixture of Experts (MoE)</h4>
                <p>
                  Features 32 specialized expert networks routed dynamically with Top-K=1 routing. This scales capacity by over 2x while maintaining minimal inference latency (+3.5%).
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#244A3B] mb-0.5 text-xs">Siamese Symmetric Fusion</h4>
                <p>
                  Protein pairs are encoded via a shared Siamese encoder and combined using element-wise Hadamard multiplication Z = X_A ⊙ X_B, guaranteeing pair permutation symmetry f(A, B) ≡ f(B, A).
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#E2E8DF] flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  setIsDocsOpen(false);
                  navigate('/research');
                }}
                className="text-[#244A3B] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Read Full Methodology</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setIsDocsOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#244A3B] text-white hover:bg-[#193C30] font-medium text-xs shadow-subtle"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Floating Toast Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
