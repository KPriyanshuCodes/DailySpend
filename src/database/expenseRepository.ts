import { storage, DB_STORAGE_KEYS } from './database';
import { Expense } from '@/types';
import { getMonthKey } from '@/utils/date';
import { categoryRepository } from './categoryRepository';

export const expenseRepository = {
  getAll(): Expense[] {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const categories = categoryRepository.getAll();
    const catMap = new Map(categories.map(c => [c.id, c]));

    // Hydrate with category details
    return expenses.map(e => {
      const cat = catMap.get(e.categoryId);
      return {
        ...e,
        categoryName: cat?.name || 'Uncategorized',
        categoryIcon: cat?.icon || 'ShoppingCart',
        categoryColor: cat?.color || '#64748b',
      };
    }).sort((a, b) => {
      // Sort by date descending, then createdAt descending
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  },

  getByMonth(monthKey: string): Expense[] {
    return this.getAll().filter(e => e.monthKey === monthKey);
  },

  getRecent(limit: number = 10): Expense[] {
    return this.getAll().slice(0, limit);
  },

  getById(id: string): Expense | undefined {
    return this.getAll().find(e => e.id === id);
  },

  create(data: { amount: number; categoryId: string; date: string; note?: string }): Expense {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const monthKey = getMonthKey(data.date);

    const newExpense: Expense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: Math.round(data.amount * 100) / 100,
      categoryId: data.categoryId,
      date: data.date,
      monthKey,
      note: data.note?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    storage.set(DB_STORAGE_KEYS.EXPENSES, expenses);

    const cat = categoryRepository.getById(newExpense.categoryId);
    return {
      ...newExpense,
      categoryName: cat?.name || 'Uncategorized',
      categoryIcon: cat?.icon || 'ShoppingCart',
      categoryColor: cat?.color || '#64748b',
    };
  },

  update(
    id: string,
    updates: Partial<{ amount: number; categoryId: string; date: string; note?: string }>
  ): Expense | null {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return null;

    const current = expenses[idx];
    const newDate = updates.date ?? current.date;
    const newMonthKey = updates.date ? getMonthKey(updates.date) : current.monthKey;

    expenses[idx] = {
      ...current,
      ...updates,
      amount: updates.amount !== undefined ? Math.round(updates.amount * 100) / 100 : current.amount,
      monthKey: newMonthKey,
      date: newDate,
      note: updates.note !== undefined ? (updates.note.trim() || undefined) : current.note,
    };

    storage.set(DB_STORAGE_KEYS.EXPENSES, expenses);

    const cat = categoryRepository.getById(expenses[idx].categoryId);
    return {
      ...expenses[idx],
      categoryName: cat?.name || 'Uncategorized',
      categoryIcon: cat?.icon || 'ShoppingCart',
      categoryColor: cat?.color || '#64748b',
    };
  },

  delete(id: string): boolean {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const filtered = expenses.filter(e => e.id !== id);
    if (filtered.length === expenses.length) return false;
    storage.set(DB_STORAGE_KEYS.EXPENSES, filtered);
    return true;
  },

  getAvailableMonthKeys(): string[] {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const set = new Set<string>();
    expenses.forEach(e => {
      if (e.monthKey) set.add(e.monthKey);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  },
};
