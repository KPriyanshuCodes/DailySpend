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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-800 border border-neutral-200/50 flex items-center justify-center mb-3 shadow-2xs">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-neutral-900 tracking-tight">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-xs mt-1.5 leading-relaxed font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
