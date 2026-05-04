'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, ToastType } from '@/stores/useToastStore';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-[#007600] flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-[#C62828] flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-[#E47911] flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-[#007185] flex-shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-white border-l-4 border-[#007600] shadow-lg',
  error:   'bg-white border-l-4 border-[#C62828] shadow-lg',
  warning: 'bg-white border-l-4 border-[#E47911] shadow-lg',
  info:    'bg-white border-l-4 border-[#007185] shadow-lg',
};

function ToastItem({ id, message, type }: { id: string; message: string; type: ToastType }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-[12px] min-w-[280px] max-w-[380px] transition-all duration-300 ${STYLES[type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {ICONS[type]}
      <span className="flex-1 text-[14px] font-medium text-[#222222] leading-[1.4]">
        {message}
      </span>
      <button
        onClick={() => dismiss(id)}
        className="p-0.5 text-[#9B9B9B] hover:text-[#222222] transition-colors flex-shrink-0"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
}
