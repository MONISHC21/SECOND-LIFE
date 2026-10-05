import React from 'react';
import { useUIStore } from '../../store/useUIStore.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all duration-200 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />}

            <div className="flex-1 text-xs">
              {toast.title && <div className="font-semibold text-white mb-0.5">{toast.title}</div>}
              <div className="text-slate-300 leading-relaxed">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
