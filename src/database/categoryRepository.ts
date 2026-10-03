import { storage, DB_STORAGE_KEYS } from './database';
import { Category, Expense } from '@/types';

export const categoryRepository = {
  getAll(): Category[] {
    return storage.get<Category[]>(DB_STORAGE_KEYS.CATEGORIES, []);
  },

  getActive(): Category[] {
    return this.getAll().filter(c => c.isActive);
  },

  getById(id: string): Category | undefined {
    return this.getAll().find(c => c.id === id);
  },

  create(data: { name: string; icon: string; color: string }): Category {
    const categories = this.getAll();
    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      icon: data.icon,
      color: data.color,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    storage.set(DB_STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },

  update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | null {
    const categories = this.getAll();
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return null;

    categories[idx] = {
      ...categories[idx],
      ...updates,
      name: updates.name ? updates.name.trim() : categories[idx].name,
    };
    storage.set(DB_STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  },

  // Soft-deactivation safety: Protects historical records
  toggleActive(id: string): Category | null {
    const categories = this.getAll();
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return null;

    categories[idx].isActive = !categories[idx].isActive;
    storage.set(DB_STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  },

  getUsageCount(categoryId: string): number {
    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const otherExpenses = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);
    return (
      expenses.filter(e => e.categoryId === categoryId).length +
      otherExpenses.filter(e => e.categoryId === categoryId).length
    );
  },

  // Safe delete: If category has expenses, safely reassign them to Uncategorized so history and totals are preserved
  delete(id: string): { success: boolean; error?: string; reassignedCount?: number } {
    const categories = this.getAll();
    const targetCat = categories.find((c) => c.id === id);
    if (!targetCat) {
      return { success: false, error: 'Category not found.' };
    }

    const expenses = storage.get<Expense[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const otherExpenses = storage.get<Expense[]>(DB_STORAGE_KEYS.OTHER_EXPENSES, []);

    const linkedExpenses = expenses.filter((e) => e.categoryId === id);
    const linkedOtherExpenses = otherExpenses.filter((e) => e.categoryId === id);
    const totalLinked = linkedExpenses.length + linkedOtherExpenses.length;

    let reassignedCount = 0;

    if (totalLinked > 0) {
      // Find or create 'Uncategorized' category to hold orphan expenses safely
      let uncat = categories.find((c) => c.id !== id && c.name.toLowerCase() === 'uncategorized');
      if (!uncat) {
        uncat = {
          id: `cat-uncat-${Date.now()}`,
          name: 'Uncategorized',
          icon: 'HelpCircle',
          color: '#71717A',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        categories.push(uncat);
      }

      // Reassign regular expenses
      if (linkedExpenses.length > 0) {
        const updated = expenses.map((e) => {
          if (e.categoryId === id) {
            return {
              ...e,
              categoryId: uncat!.id,
              categoryName: uncat!.name,
              categoryIcon: uncat!.icon,
              categoryColor: uncat!.color,
            };
          }
          return e;
        });
        storage.set(DB_STORAGE_KEYS.EXPENSES, updated);
      }

      // Reassign other expenses
      if (linkedOtherExpenses.length > 0) {
        const updatedOther = otherExpenses.map((e) => {
          if (e.categoryId === id) {
            return {
              ...e,
              categoryId: uncat!.id,
              categoryName: uncat!.name,
              categoryIcon: uncat!.icon,
              categoryColor: uncat!.color,
            };
          }
          return e;
        });
        storage.set(DB_STORAGE_KEYS.OTHER_EXPENSES, updatedOther);
      }

      reassignedCount = totalLinked;
    }

    // Remove the target category from categories list
    const remaining = categories.filter((c) => c.id !== id);
    storage.set(DB_STORAGE_KEYS.CATEGORIES, remaining);

    return { success: true, reassignedCount };
  },
};
