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
    return expenses.filter(e => e.categoryId === categoryId).length;
  },

  // Permanent delete only if no historical expenses exist
  delete(id: string): { success: boolean; error?: string } {
    const usageCount = this.getUsageCount(id);
    if (usageCount > 0) {
      return {
        success: false,
        error: `Cannot delete: Category is linked to ${usageCount} recorded expense(s). Use deactivation instead to preserve your financial records.`,
      };
    }

    const categories = this.getAll().filter(c => c.id !== id);
    storage.set(DB_STORAGE_KEYS.CATEGORIES, categories);
    return { success: true };
  },
};
