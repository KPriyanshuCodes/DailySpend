import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { generateMonthList, formatMonthLabel, getMonthKey } from '@/utils/date';

interface MonthSelectorProps {
  selectedMonthKey: string;
  onSelectMonth: (monthKey: string) => void;
  availableMonthKeys?: string[];
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonthKey,
  onSelectMonth,
  availableMonthKeys = [],
}) => {
  const months = generateMonthList(availableMonthKeys);
  const currentIndex = months.findIndex((m) => m.key === selectedMonthKey);
  const currentMonthKey = getMonthKey();

  const handlePrev = () => {
    if (currentIndex < months.length - 1) {
      onSelectMonth(months[currentIndex + 1].key);
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      onSelectMonth(months[currentIndex - 1].key);
    }
  };

  return (
    <div className="bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(28,25,23,0.02)] rounded-2xl p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex >= months.length - 1}
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100/70 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous Month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#B85D38]" />
          <span className="font-extrabold text-stone-900 text-sm sm:text-base tracking-tight">
            {formatMonthLabel(selectedMonthKey)}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex <= 0}
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100/70 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next Month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
        {months.map((m) => {
          const isSelected = m.key === selectedMonthKey;
          const isCurrent = m.key === currentMonthKey;
          return (
            <button
              key={m.key}
              onClick={() => onSelectMonth(m.key)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white/60 text-stone-600 hover:bg-white border border-stone-200/40'
              }`}
            >
              {m.label.split(' ')[0]} {m.label.split(' ')[1] ? `'${m.label.split(' ')[1].slice(2)}` : ''} {isCurrent ? '•' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
