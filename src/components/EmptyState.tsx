import React from 'react';
import { LucideIcon, PlusCircle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-stone-200 shadow-[0_2px_12px_rgba(28,25,23,0.02)]">
      <div className="w-13 h-13 rounded-2xl bg-[#B85D38]/10 text-[#B85D38] border border-[#B85D38]/15 flex items-center justify-center mb-3 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-stone-900 tracking-tight">{title}</h3>
      <p className="text-xs text-stone-500 max-w-xs mt-1.5 leading-relaxed font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85D38] hover:bg-[#A24E2B] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
