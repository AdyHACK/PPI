import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { BotanicalLeaf } from './BotanicalElements';

const PAGE_METADATA = {
  '/': { title: 'Dashboard', breadcrumb: 'Overview' },
  '/predict': { title: 'PPI Prediction Engine', breadcrumb: 'Prediction' },
  '/results': { title: 'Prediction Analysis', breadcrumb: 'Results' },
  '/proteins': { title: 'Protein Catalog', breadcrumb: 'Protein Explorer' },
  '/network': { title: 'Interaction Network', breadcrumb: 'Network' },
  '/architecture': { title: 'Model Architecture', breadcrumb: 'Architecture' },
  '/datasets': { title: 'Dataset Explorer', breadcrumb: 'Datasets' },
  '/performance': { title: 'Model Performance', breadcrumb: 'Performance' },
  '/research': { title: 'Research & Methodology', breadcrumb: 'Research' },
  '/settings': { title: 'Platform Settings', breadcrumb: 'Settings' }
};

export default function Navbar({ 
  onOpenMobileMenu, 
  onOpenSearch, 
  onOpenNotifications, 
  unreadCount = 2,
  onOpenDocs 
}) {
  const location = useLocation();
  const currentMeta = PAGE_METADATA[location.pathname] || { title: 'InteractomeX', breadcrumb: 'Overview' };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-white/95 backdrop-blur-sm border-b border-[#E2E8DF]">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg border border-[#E2E8DF] text-[#66786C] hover:text-[#193C30] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={16} />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#66786C]">
            <Link to="/" className="hover:text-[#193C30] transition-colors">InteractomeX</Link>
            <span>/</span>
            <span className="text-[#193C30] font-semibold">{currentMeta.breadcrumb}</span>
          </div>
          <h1 className="text-sm md:text-base font-heading font-bold text-[#193C30] tracking-tight leading-none mt-0.5 truncate max-w-xs md:max-w-md">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Search, Status & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] hover:border-[#91A88F] text-[#66786C] hover:text-[#193C30] transition-all text-xs"
          title="Search proteins, datasets, and architecture"
        >
          <Search size={13} className="text-[#91A88F]" />
          <span className="hidden sm:inline text-xs">Search interactome...</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E2E8DF] rounded text-[#718074]">
            ⌘K
          </kbd>
        </button>

        {/* Demo Mode Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF0E7] border border-[#D1E0CE] text-[11px] font-mono text-[#193C30]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#43866B]"></span>
          <span>Botanical AI Demo</span>
        </div>

        {/* Quick Methodology / Docs Modal Trigger */}
        <button
          onClick={onOpenDocs}
          className="p-1.5 rounded-lg border border-[#E2E8DF] hover:border-[#88A58B] text-[#758379] hover:text-[#244A3B] transition-colors"
          title="Methodology Quick Reference"
        >
          <BookOpen size={15} />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg border border-[#E2E8DF] hover:border-[#88A58B] text-[#758379] hover:text-[#244A3B] transition-colors"
          title="Activity & Notifications"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#43866B]"></span>
          )}
        </button>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8DF]">
          <div className="w-7 h-7 rounded-full bg-[#EEF4ED] border border-[#D1E0CE] flex items-center justify-center text-xs font-bold text-[#244A3B]">
            AC
          </div>
          <div className="hidden 2xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#244A3B] leading-none">Dr. Alex Chen</span>
            <span className="text-[10px] font-mono text-[#758379] mt-0.5">Bioinformatics Lab</span>
          </div>
        </div>
      </div>
    </header>
  );
}
