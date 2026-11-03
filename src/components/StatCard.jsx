import React from 'react';
import { BotanicalLeaf } from './BotanicalElements';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  badge, 
  isDemo = true,
  botanicalAccent = false
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8DF] shadow-subtle flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-[#91A88F] relative overflow-hidden group">
      {/* Delicate background leaf silhouette for botanical accent */}
      {botanicalAccent && (
        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none group-hover:opacity-12 transition-opacity">
          <BotanicalLeaf className="w-24 h-24 text-[#234737]" />
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#66786C] uppercase tracking-wider font-mono">{title}</span>
            {isDemo && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF9F3] text-[#718074] border border-[#E2E8DF]">
                DEMO
              </span>
            )}
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#193C30] tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#D1E0CE] flex items-center justify-center text-[#234737] flex-shrink-0 group-hover:bg-[#DDEADF] group-hover:scale-105 transition-all">
            <Icon size={18} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs relative z-10">
          <span className="text-[#718074] truncate text-[11px]">{subtitle}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-medium bg-[#EAF0E7] text-[#193C30] border border-[#D1E0CE]">
              {badge}
            </span>
          )}
          {trend && (
            <span className="font-mono text-[#43866B] font-semibold text-[11px]">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
