import { storage, DB_STORAGE_KEYS } from './database';
import { Settings } from '@/types';

export function runInitialMigrations(): void {
  // Clear out any old sample/demo data from previous test runs
  const cleanedDemoData = storage.get<boolean>('dailyspend_cleared_sample_data_v3', false);
  if (!cleanedDemoData) {
    const existingExpenses = storage.get<any[]>(DB_STORAGE_KEYS.EXPENSES, []);
    const hasDemoData = existingExpenses.some((e) => e.id && String(e.id).startsWith('demo-exp'));
    const isFirstRun = !storage.get<boolean>(DB_STORAGE_KEYS.INITIALIZED, false);

    if (hasDemoData || isFirstRun) {
      // Start with completely blank slate: no demo categories, no demo expenses
      storage.set(DB_STORAGE_KEYS.CATEGORIES, []);
      storage.set(DB_STORAGE_KEYS.EXPENSES, []);
    }
    storage.set('dailyspend_cleared_sample_data_v3', true);
  }

  const isInitialized = storage.get<boolean>(DB_STORAGE_KEYS.INITIALIZED, false);
  if (!isInitialized) {
    storage.set(DB_STORAGE_KEYS.CATEGORIES, []);
    storage.set(DB_STORAGE_KEYS.EXPENSES, []);

    const defaultSettings: Settings = {
      currency: '₹',
      currencyPosition: 'prefix',
    };
    storage.set(DB_STORAGE_KEYS.SETTINGS, defaultSettings);
    storage.set(DB_STORAGE_KEYS.INITIALIZED, true);
  }
}
