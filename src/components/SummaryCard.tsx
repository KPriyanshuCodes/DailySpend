import React from 'react';
import { TrendingUp, ReceiptText, Calendar } from 'lucide-react';
import { MonthlySummary } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { CategoryIcon } from './CategoryIcon';

interface SummaryCardProps {
  summary: MonthlySummary;
  currency: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, currency }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Primary Hero Spent Banner in Light Frosted Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(28,25,23,0.03)] p-6 transition-all">
        {/* Subtle warm cream inner atmosphere */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
              Total Spent • {summary.monthLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-stone-100/70 border border-stone-200/60 text-stone-600 px-2.5 py-0.5 rounded-full">
              <ReceiptText className="w-3 h-3 text-stone-400" />
              {summary.transactionCount} {summary.transactionCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              {formatCurrency(summary.totalSpent, currency)}
            </h1>
          </div>

          {/* Daily average on Total Spent • Month */}
          <div className="mt-4 pt-3.5 border-t border-stone-200/50 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Daily Average
            </span>
            <span className="font-extrabold text-stone-900 text-sm">
              {formatCurrency(summary.dailyAverage, currency)}{' '}
              <span className="text-xs font-normal text-stone-400">/ day</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top Expense Category Card in Light Frosted Glass */}
      {summary.highestCategory && (
        <div className="bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(28,25,23,0.02)] rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
              style={{
                backgroundColor: `${summary.highestCategory.color}15`,
                color: summary.highestCategory.color,
              }}
            >
              <CategoryIcon name={summary.highestCategory.icon} size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Top Category
                </span>
                <TrendingUp className="w-3 h-3 text-[#B85D38]" />
              </div>
              <p className="text-sm font-extrabold text-stone-900 truncate mt-0.5">
                {summary.highestCategory.name}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-extrabold text-stone-900 block">
              {formatCurrency(summary.highestCategory.amount, currency)}
            </span>
            <span className="text-[11px] font-semibold text-[#B85D38] bg-[#B85D38]/10 border border-[#B85D38]/15 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {summary.highestCategory.percentage}% of total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
