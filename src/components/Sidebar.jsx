import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Binary, 
  Dna, 
  Share2, 
  Cpu, 
  Database, 
  BarChart3, 
  BookOpen, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { BotanicalLeaf } from './BotanicalElements';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/predict', label: 'PPI Prediction', icon: Binary, highlight: true },
    { to: '/results', label: 'Prediction Results', icon: Sparkles },
    { to: '/proteins', label: 'Protein Explorer', icon: Dna },
    { to: '/network', label: 'Interaction Network', icon: Share2 },
    { to: '/architecture', label: 'Model Architecture', icon: Cpu },
    { to: '/datasets', label: 'Dataset Explorer', icon: Database },
    { to: '/performance', label: 'Model Performance', icon: BarChart3 },
    { to: '/research', label: 'Research & Methodology', icon: BookOpen },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#193C30]/25 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E2E8DF] transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8DF]">
          <NavLink to="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] flex items-center justify-center group-hover:border-[#91A88F] transition-colors">
              <img src="/logo.svg" alt="InteractomeX Logo" className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-heading font-bold text-base tracking-tight text-[#193C30]">
                    Interactome<span className="text-[#6B9B8B]">X</span>
                  </span>
                  <BotanicalLeaf className="w-3.5 h-3.5 text-[#91A88F]" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#718074] truncate">
                  Biological Intelligence
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md border border-[#E2E8DF] text-[#718074] hover:text-[#193C30] hover:bg-[#F0F4EC] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-[#EAF0E7] text-[#193C30] font-semibold border-l-3 border-[#234737]' 
                    : 'text-[#66786C] hover:text-[#193C30] hover:bg-[#F0F4EC]'}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={17} 
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#234737]' : 'text-[#718074]'
                      }`} 
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {item.highlight && !isCollapsed && (
                      <span className="ml-auto text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#DDEADF] text-[#244A3B] border border-[#C5D9C8]">
                        CORE
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Environment Status Card */}
        <div className="p-3 border-t border-[#E2E8DF]">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#43866B] animate-pulse"></span>
                  <span className="font-heading font-semibold text-[11px] text-[#244A3B]">Research Demo</span>
                </div>
                <span className="text-[9px] font-mono text-[#758379]">v1.0</span>
              </div>
              <p className="text-[11px] text-[#758379] leading-relaxed">
                Botanical AI scientific simulation active.
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-1" title="Research Demo Environment Active">
              <span className="w-2 h-2 rounded-full bg-[#43866B]"></span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
