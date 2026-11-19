import React from 'react';
import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toast: Toast | null;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toast }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-gold/30 bg-navy px-5 py-3 shadow-2xl font-main">
      <span
        className={`inline-block h-3 w-3 rounded-full ${
          isSuccess ? 'bg-emerald-400' : 'bg-red-400'
        }`}
      />
      <span className="text-sm text-gold">{toast.text}</span>
    </div>
  );
};
