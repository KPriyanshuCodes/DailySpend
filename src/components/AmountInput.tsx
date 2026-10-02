import React from 'react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency,
  error,
}) => {
  const quickIncrements = [5, 25, 50, 75, 100, 150, 500];

  const handleQuickAdd = (increment: number) => {
    const current = parseFloat(value) || 0;
    const newAmount = Math.round((current + increment) * 100) / 100;
    onChange(newAmount.toString());
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
        Expense Amount
      </label>
      <div className="relative flex items-center justify-center w-full max-w-xs">
        <span className="text-3xl sm:text-4xl font-extrabold text-[#B85D38] mr-2 select-none">
          {currency}
        </span>
        <input
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-center text-4xl sm:text-5xl font-extrabold text-stone-900 bg-transparent border-b-2 py-2 outline-none transition-all ${
            error
              ? 'border-rose-500 text-rose-600'
              : 'border-stone-200 focus:border-[#B85D38]'
          }`}
          autoFocus
        />
      </div>

      {error && <p className="text-rose-500 text-xs font-semibold mt-1.5">{error}</p>}

      {/* Quick Increment Pills in Light Glass */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
        {quickIncrements.map((inc) => (
          <button
            key={inc}
            type="button"
            onClick={() => handleQuickAdd(inc)}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-[#B85D38] border border-stone-200/60 shadow-2xs transition-colors cursor-pointer"
          >
            +{inc}
          </button>
        ))}
      </div>
    </div>
  );
};
