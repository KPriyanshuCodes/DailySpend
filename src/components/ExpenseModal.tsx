import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, FileText, Check, Plus, TrendingUp } from 'lucide-react';
import { Category, Expense } from '@/types';
import { AmountInput } from './AmountInput';
import { CategoryIcon } from './CategoryIcon';
import { CategoryModal } from './CategoryModal';
import { getTodayFormatted, getYesterdayFormatted, formatDateFull, getMonthKey, formatMonthLabel } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { amount: number; categoryId: string; date: string; note?: string }) => void;
  categories: Category[];
  editingExpense?: Expense | null;
  currency: string;
  initialCategoryId?: string;
  onCreateCategory?: (data: { name: string; icon: string; color: string }) => Category;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingExpense,
  currency,
  initialCategoryId,
  onCreateCategory,
}) => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayFormatted());
  const [note, setNote] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');

  // Custom Increment states
  const [incrementStr, setIncrementStr] = useState<string>('');
  const [incrementError, setIncrementError] = useState<string>('');
  const [incrementSuccessMsg, setIncrementSuccessMsg] = useState<string>('');

  // Create another category state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newlyCreatedCatName, setNewlyCreatedCatName] = useState<string | null>(null);

  useEffect(() => {
    if (editingExpense) {
      setAmountStr(editingExpense.amount.toString());
      setSelectedCategoryId(editingExpense.categoryId);
      setDate(editingExpense.date);
      setNote(editingExpense.note || '');
    } else {
      setAmountStr('');
      const defaultCatId = initialCategoryId || categories.find((c) => c.isActive)?.id || '';
      setSelectedCategoryId(defaultCatId);
      setDate(getTodayFormatted());
      setNote('');
    }
    setAmountError('');
    setCategoryError('');
    setDateError('');
    setIncrementStr('');
    setIncrementError('');
    setIncrementSuccessMsg('');
    setIsCreatingCategory(false);
    setNewlyCreatedCatName(null);
  }, [editingExpense, isOpen, categories, initialCategoryId]);

  if (!isOpen) return null;

  // For new expense, show only active categories. For editing, also allow the existing category.
  const visibleCategories = categories.filter(
    (c) => c.isActive || (editingExpense && c.id === editingExpense.categoryId)
  );

  const handleApplyIncrement = (immediateSave: boolean = false) => {
    const inc = parseFloat(incrementStr);
    if (isNaN(inc) || inc <= 0) {
      setIncrementError(`Please enter a valid positive increment greater than ${currency}0.`);
      return;
    }

    const current = parseFloat(amountStr) || 0;
    const newAmount = Math.round((current + inc) * 100) / 100;

    setAmountStr(newAmount.toString());
    setIncrementError('');
    setIncrementSuccessMsg(`Added ${formatCurrency(inc, currency)}! New amount: ${formatCurrency(newAmount, currency)}`);
    setIncrementStr('');

    if (amountError) setAmountError('');

    if (immediateSave && editingExpense && selectedCategoryId) {
      onSave({
        amount: newAmount,
        categoryId: selectedCategoryId,
        date,
        note: note.trim() || undefined,
      });
      onClose();
    }
  };

  const parsedCurrentAmount = parseFloat(amountStr) || 0;
  const parsedIncrement = parseFloat(incrementStr);
  const isValidIncrement = !isNaN(parsedIncrement) && parsedIncrement > 0;
  const previewNewAmount = isValidIncrement
    ? Math.round((parsedCurrentAmount + parsedIncrement) * 100) / 100
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Please enter a valid positive amount.');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (!selectedCategoryId) {
      setCategoryError('Please select a category or create a new one.');
      hasError = true;
    } else {
      setCategoryError('');
    }

    const selectedDate = (date || '').trim();
    if (!selectedDate || isNaN(new Date(selectedDate).getTime())) {
      setDateError('Please select a valid date.');
      hasError = true;
    } else {
      setDateError('');
    }

    if (hasError) return;

    onSave({
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      date: selectedDate,
      note: note.trim() || undefined,
    });
    onClose();
  };

  const today = getTodayFormatted();
  const yesterday = getYesterdayFormatted();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(28,25,23,0.12)] overflow-hidden border border-white/90 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/50 bg-white/50">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            {editingExpense && (
              <p className="text-[11px] text-stone-500 font-medium">
                Adjust amount or use custom increment
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-5">
          {/* Normal Amount input */}
          <div className="flex flex-col">
            <AmountInput
              value={amountStr}
              onChange={(val) => {
                setAmountStr(val);
                if (amountError) setAmountError('');
                if (incrementSuccessMsg) setIncrementSuccessMsg('');
              }}
              currency={currency}
              error={amountError}
            />
          </div>

          {/* Custom Increment Box in Soft Warm Cream Frosted Glass */}
          <div className="bg-[#FAF4ED]/80 border border-[#ECD9C6] rounded-2xl p-4 flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#B85D38]" />
                Increase by (Custom Increment)
              </label>
              <span className="text-[10px] font-bold text-[#B85D38] bg-white/90 px-2 py-0.5 rounded-full border border-[#ECD9C6]">
                Auto-adds to amount
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Enter any amount to add to current expense{' '}
              <span className="font-extrabold text-stone-900">
                ({formatCurrency(parsedCurrentAmount, currency)})
              </span>.
            </p>

            {/* Input and Add Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-[#B85D38] select-none">
                  +{currency}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="Increase by (e.g. 20)"
                  value={incrementStr}
                  onChange={(e) => {
                    setIncrementStr(e.target.value);
                    if (incrementError) setIncrementError('');
                    if (incrementSuccessMsg) setIncrementSuccessMsg('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyIncrement(false);
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm font-bold rounded-xl border bg-white/90 text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                    incrementError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-[#ECD9C6] focus:border-[#B85D38]'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => handleApplyIncrement(false)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#B85D38] hover:bg-[#A24E2B] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-3" />
                Add
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold text-stone-500">Quick:</span>
              {[5, 20, 25, 50, 75, 150].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setIncrementStr(chip.toString());
                    if (incrementError) setIncrementError('');
                    if (incrementSuccessMsg) setIncrementSuccessMsg('');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-[#ECD9C6] shadow-2xs transition-colors cursor-pointer"
                >
                  +{chip}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {incrementError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                {incrementError}
              </p>
            )}

            {/* Live Calculation Preview */}
            {isValidIncrement && previewNewAmount !== null && (
              <div className="text-xs font-bold text-stone-900 bg-white/80 p-2.5 rounded-xl border border-[#ECD9C6] flex items-center justify-between">
                <span className="text-stone-600">
                  Current: {formatCurrency(parsedCurrentAmount, currency)} + {formatCurrency(parsedIncrement, currency)}
                </span>
                <span className="text-[#B85D38] font-extrabold text-sm">
                  ➔ New: {formatCurrency(previewNewAmount, currency)}
                </span>
              </div>
            )}

            {/* Success Feedback Banner */}
            {incrementSuccessMsg && (
              <div className="text-xs font-bold text-stone-900 bg-white px-3 py-2 rounded-xl border border-[#ECD9C6] flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-[#B85D38] stroke-3 shrink-0" />
                <span>{incrementSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Category Picker Section with Create Option */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#B85D38]" />
                Select Category
              </label>
              <div className="flex items-center gap-2">
                {categoryError && (
                  <span className="text-[11px] font-semibold text-rose-500">{categoryError}</span>
                )}
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(true)}
                    className="text-xs font-bold text-[#B85D38] hover:text-[#A24E2B] bg-[#B85D38]/10 hover:bg-[#B85D38]/15 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer border border-[#B85D38]/20"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-3" />
                    <span>New Category</span>
                  </button>
                )}
              </div>
            </div>

            {visibleCategories.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center flex flex-col items-center">
                <p className="text-xs text-amber-900 font-semibold mb-2">
                  No active categories available.
                </p>
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B85D38] hover:bg-[#A24E2B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-3" />
                    Create First Category
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {visibleCategories.map((cat) => {
                  const isSelected = cat.id === selectedCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        if (categoryError) setCategoryError('');
                        setNewlyCreatedCatName(null);
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#B85D38] bg-[#B85D38]/10 shadow-xs ring-1 ring-[#B85D38]'
                          : 'border-stone-200/50 bg-white/70 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        <CategoryIcon name={cat.icon} size={18} />
                      </div>
                      <span
                        className={`text-xs font-semibold truncate w-full ${
                          isSelected ? 'text-[#B85D38] font-extrabold' : 'text-stone-700'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}

                {/* + Add New Category Card inside grid */}
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(true)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 border-dashed border-stone-200 hover:border-[#B85D38] bg-white/40 hover:bg-[#B85D38]/5 text-stone-500 hover:text-[#B85D38] transition-all text-center cursor-pointer group"
                    title="Create another category"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 bg-white border border-stone-200 group-hover:border-[#B85D38]/40 text-stone-400 group-hover:text-[#B85D38] shadow-2xs transition-colors">
                      <Plus className="w-4 h-4 stroke-3" />
                    </div>
                    <span className="text-xs font-bold truncate w-full text-stone-600 group-hover:text-[#B85D38]">
                      + Add New
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Notification when a category is newly created */}
            {newlyCreatedCatName && (
              <div className="mt-2 text-xs font-bold text-stone-900 bg-[#FAF4ED] px-3 py-1.5 rounded-xl border border-[#ECD9C6] flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-[#B85D38] stroke-3 shrink-0" />
                <span>Created & selected "{newlyCreatedCatName}"</span>
              </div>
            )}
          </div>

          {/* Date Selector with Previous Date Support */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B85D38]" />
                Expense Date
              </label>
              {date !== today && (
                <span className="text-[10px] font-bold text-[#B85D38] bg-[#B85D38]/10 px-2 py-0.5 rounded-full border border-[#B85D38]/20">
                  {date === yesterday ? 'Yesterday' : 'Past Date'}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDate(today);
                    if (dateError) setDateError('');
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    date === today
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white/70 text-stone-600 border-stone-200/60 hover:bg-white'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDate(yesterday);
                    if (dateError) setDateError('');
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    date === yesterday
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white/70 text-stone-600 border-stone-200/60 hover:bg-white'
                  }`}
                >
                  Yesterday
                </button>

                {/* Native Date Picker allowing any previous date */}
                <div className="relative flex-1">
                  <input
                    type="date"
                    max={today}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (dateError) setDateError('');
                    }}
                    className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl border bg-white/80 text-stone-900 focus:outline-none transition-colors cursor-pointer ${
                      dateError
                        ? 'border-rose-500 text-rose-600'
                        : date !== today && date !== yesterday
                        ? 'border-[#B85D38] ring-1 ring-[#B85D38]/25 text-[#B85D38]'
                        : 'border-stone-200/80 focus:border-[#B85D38]'
                    }`}
                    title="Select any date"
                  />
                </div>
              </div>

              {/* Dynamic date feedback */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>
                    Selected: <strong className="text-stone-800">{formatDateFull(date || today)}</strong>
                  </span>
                  {date === today && (
                    <span className="text-emerald-700 font-semibold">Today's Spend</span>
                  )}
                </div>

                {/* Previous month indicator notice */}
                {date && getMonthKey(date) !== getMonthKey() && (
                  <div className="text-[11px] font-bold text-[#B85D38] bg-[#FAF4ED] border border-[#ECD9C6] px-2.5 py-1 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>
                      Recording for {formatMonthLabel(getMonthKey(date))} (will appear in {formatMonthLabel(getMonthKey(date))} history & totals)
                    </span>
                  </div>
                )}
              </div>

              {dateError && (
                <p className="text-rose-500 text-xs font-semibold">{dateError}</p>
              )}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-[#B85D38]" />
              Optional Note
            </label>
            <input
              type="text"
              placeholder="e.g. Milk, grocery trip, lunch"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200/80 bg-white/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#B85D38] focus:bg-white transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={visibleCategories.length === 0}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#B85D38] hover:bg-[#A24E2B] disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-[#B85D38]/20 transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {editingExpense
                ? `Update Expense (${formatCurrency(parsedCurrentAmount, currency)})`
                : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>

      {/* Sub-modal: Create Another Category without losing expense draft */}
      {isCreatingCategory && onCreateCategory && (
        <CategoryModal
          isOpen={isCreatingCategory}
          zIndex="z-60"
          onClose={() => setIsCreatingCategory(false)}
          onSave={(catData) => {
            const created = onCreateCategory(catData);
            if (created && created.id) {
              setSelectedCategoryId(created.id);
              setNewlyCreatedCatName(created.name);
              if (categoryError) setCategoryError('');
            }
            setIsCreatingCategory(false);
          }}
        />
      )}
    </div>
  );
};
