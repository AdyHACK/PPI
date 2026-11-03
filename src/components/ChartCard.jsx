import React from 'react';

export default function ChartCard({ 
  title, 
  subtitle, 
  badge, 
  source, 
  children, 
  action, 
  height = 'h-72',
  className = '' 
}) {
  return (
    <div className={`bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-subtle hover:border-[#91A88F]/60 transition-colors flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-[#193C30] text-sm md:text-base tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#EAF0E7] text-[#193C30] border border-[#D1E0CE]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#52665A] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Main Chart Area */}
      <div className={`w-full ${height} relative`}>
        {children}
      </div>

      {/* Footer / Scientific Attribution */}
      {source && (
        <div className="mt-3 pt-2.5 border-t border-[#E2E8DF] flex items-center justify-between text-[11px] font-mono text-[#66786C]">
          <span>Source: <strong className="text-[#193C30] font-semibold">{source}</strong></span>
          <span className="text-[10px] uppercase tracking-wider text-[#718074]">InteractomeX Botanical AI</span>
        </div>
      )}
    </div>
  );
}
