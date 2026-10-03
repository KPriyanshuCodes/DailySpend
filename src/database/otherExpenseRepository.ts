import { storage, DB_STORAGE_KEYS } from './database';
import { Expense, CategorySummary } from '@/types';
import { getMonthKey } from '@/utils/date';
import { categoryRepository } from './categoryRepository';

export const otherExpenseRepository = {
  getAll(): Expense[] {
    const items = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);
    const categories = categoryRepository.getAll();
    const catMap = new Map(categories.map((c) => [c.id, c]));

    return items
      .map((e) => {
        const cat = catMap.get(e.categoryId);
        return {
          ...e,
          categoryName: cat?.name || 'Uncategorized',
          categoryIcon: cat?.icon || 'ShoppingCart',
          categoryColor: cat?.color || '#64748b',
        };
      })
      .sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        return b.createdAt.localeCompare(a.createdAt);
      });
  },

  getById(id: string): Expense | undefined {
    return this.getAll().find((e) => e.id === id);
  },

  create(data: { amount: number; categoryId: string; date: string; note?: string }): Expense {
    const items = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);
    const monthKey = getMonthKey(data.date);

    const newExpense: Expense = {
      id: `oth-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: Math.round(data.amount * 100) / 100,
      categoryId: data.categoryId,
      date: data.date,
      monthKey,
      note: data.note?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    items.push(newExpense);
    storage.set(DB_STORAGE_KEYS.OTHER_EXPENSES, items);

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
    const items = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);
    const idx = items.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const current = items[idx];
    const newDate = updates.date ?? current.date;
    const newMonthKey = updates.date ? getMonthKey(updates.date) : current.monthKey;

    items[idx] = {
      ...current,
      ...updates,
      amount: updates.amount !== undefined ? Math.round(updates.amount * 100) / 100 : current.amount,
      monthKey: newMonthKey,
      date: newDate,
      note: updates.note !== undefined ? updates.note.trim() || undefined : current.note,
    };

    storage.set(DB_STORAGE_KEYS.OTHER_EXPENSES, items);

    const cat = categoryRepository.getById(items[idx].categoryId);
    return {
      ...items[idx],
      categoryName: cat?.name || 'Uncategorized',
      categoryIcon: cat?.icon || 'ShoppingCart',
      categoryColor: cat?.color || '#64748b',
    };
  },

  delete(id: string): boolean {
    const items = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);
    const filtered = items.filter((e) => e.id !== id);
    if (filtered.length === items.length) return false;
    storage.set(DB_STORAGE_KEYS.OTHER_EXPENSES, filtered);
    return true;
  },

  getCategoryTotals(filteredExpenses?: Expense[]): CategorySummary[] {
    const expenses = filteredExpenses ?? this.getAll();
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categories = categoryRepository.getAll();
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const catTotalMap = new Map<string, { total: number; count: number }>();
    expenses.forEach((e) => {
      const existing = catTotalMap.get(e.categoryId) || { total: 0, count: 0 };
      catTotalMap.set(e.categoryId, {
        total: existing.total + e.amount,
        count: existing.count + 1,
      });
    });

    return Array.from(catTotalMap.entries())
      .map(([catId, data]) => {
        const cat = catMap.get(catId);
        const percentage = totalSpent > 0 ? Math.round((data.total / totalSpent) * 1000) / 10 : 0;
        return {
          categoryId: catId,
          categoryName: cat?.name || 'Uncategorized',
          categoryIcon: cat?.icon || 'ShoppingCart',
          categoryColor: cat?.color || '#64748b',
          totalAmount: data.total,
          percentage,
          transactionCount: data.count,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);
  },
};
