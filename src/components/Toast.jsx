import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const typeClasses = {
          success: 'border-[#D1E0CE] bg-white text-[#43866B]',
          error: 'border-[#F2D4D4] bg-white text-[#C87575]',
          info: 'border-[#CADED8] bg-white text-[#659A8B]'
        };

        const Icon = toast.type === 'success' ? CheckCircle2 :
                     toast.type === 'error' ? AlertCircle : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-xl border shadow-dropdown flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 ${typeClasses[toast.type] || typeClasses.info}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon size={16} className="flex-shrink-0" />
              <div className="min-w-0">
                {toast.title && <div className="font-semibold text-xs text-[#244A3B]">{toast.title}</div>}
                <div className="text-xs text-[#244A3B] truncate">{toast.message}</div>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#758379] hover:text-[#244A3B] p-1 rounded-md"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
