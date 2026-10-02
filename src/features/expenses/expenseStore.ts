import { create } from 'zustand';
import { Expense } from '@/types';
import { expenseRepository } from '@/database/expenseRepository';
import { getMonthKey } from '@/utils/date';

interface ExpenseState {
  expenses: Expense[];
  selectedMonthKey: string;
  loadExpenses: () => void;
  setSelectedMonthKey: (monthKey: string) => void;
  addExpense: (data: { amount: number; categoryId: string; date: string; note?: string }) => Expense;
  updateExpense: (id: string, updates: Partial<{ amount: number; categoryId: string; date: string; note?: string }>) => boolean;
  deleteExpense: (id: string) => boolean;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: expenseRepository.getAll(),
  selectedMonthKey: getMonthKey(),

  loadExpenses: () => {
    set({ expenses: expenseRepository.getAll() });
  },

  setSelectedMonthKey: (monthKey: string) => {
    set({ selectedMonthKey: monthKey });
  },

  addExpense: (data) => {
    const newExp = expenseRepository.create(data);
    set({
      expenses: expenseRepository.getAll(),
      // Auto-jump to the month of the added expense so the user sees it immediately
      selectedMonthKey: newExp.monthKey,
    });
    return newExp;
  },

  updateExpense: (id, updates) => {
    const updated = expenseRepository.update(id, updates);
    if (updated) {
      set({
        expenses: expenseRepository.getAll(),
        selectedMonthKey: updated.monthKey,
      });
      return true;
    }
    return false;
  },

  deleteExpense: (id) => {
    const success = expenseRepository.delete(id);
    if (success) {
      set({ expenses: expenseRepository.getAll() });
    }
    return success;
  },
}));
