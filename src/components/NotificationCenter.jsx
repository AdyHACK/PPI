import React from 'react';
import { X, Bell, Database, Sparkles, AlertTriangle } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Benchmark Sync Completed',
      message: 'STRING v12.0 and BioGRID v4.4 cross-species evaluation metrics synchronized.',
      time: '12m ago',
      icon: Database
    },
    {
      id: 2,
      title: 'Simulated MoE Router Active',
      message: '32-Expert Top-1 conditional gating engine initialized in client demonstration mode.',
      time: '1h ago',
      icon: Sparkles
    },
    {
      id: 3,
      title: 'Sequence Tokenization Limit',
      message: 'ESM-2 protocol auto-truncates amino acid sequences exceeding 1,024 residues.',
      time: '3h ago',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#193C30]/25 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white border-l border-[#E2E8DF] h-full shadow-dropdown flex flex-col justify-between p-5 z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8DF] mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#244A3B]" />
              <h3 className="font-heading font-bold text-[#244A3B] text-sm">
                Activity &amp; Notifications
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-[#758379] hover:text-[#244A3B] hover:bg-[#FAF9F3]"
            >
              <X size={15} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className="p-3 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF] text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8DF] flex items-center justify-center text-[#244A3B] flex-shrink-0 mt-0.5">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#244A3B] text-[11px]">{item.title}</h4>
                        <span className="font-mono text-[9px] text-[#758379]">{item.time}</span>
                      </div>
                      <p className="text-[#758379] mt-1 text-[11px] leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2E8DF] flex justify-between items-center text-[10px] font-mono text-[#758379]">
          <span>InteractomeX Biological AI</span>
          <span className="text-[#43866B] font-semibold">● Operational</span>
        </div>
      </div>
    </div>
  );
}
