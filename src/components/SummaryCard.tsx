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
      {/* Primary Hero Spent Banner in Light Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 transition-all">
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-neutral-500">
              Total Spent · {summary.monthLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full">
              <ReceiptText className="w-3 h-3 text-neutral-400" />
              {summary.transactionCount} {summary.transactionCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-mono tabular-nums">
              {formatCurrency(summary.totalSpent, currency)}
            </h1>
          </div>

          {/* Daily average on Total Spent • Month */}
          <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-normal">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              Daily Average
            </span>
            <span className="font-bold text-neutral-900 text-sm font-mono tabular-nums">
              {formatCurrency(summary.dailyAverage, currency)}{' '}
              <span className="text-xs font-normal text-neutral-400">/ day</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top Expense Category Card in Light Glass */}
      {summary.highestCategory && (
        <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center shrink-0 text-neutral-800">
              <CategoryIcon name={summary.highestCategory.icon} size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Top Category
                </span>
                <TrendingUp className="w-3 h-3 text-neutral-600" />
              </div>
              <p className="text-sm font-bold text-neutral-900 truncate mt-0.5">
                {summary.highestCategory.name}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-bold font-mono text-neutral-900 block tabular-nums">
              {formatCurrency(summary.highestCategory.amount, currency)}
            </span>
            <span className="text-[11px] font-medium text-neutral-500 inline-block mt-0.5">
              {summary.highestCategory.percentage}% of total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
