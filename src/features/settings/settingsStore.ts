import { create } from 'zustand';
import { Settings } from '@/types';
import { storage, DB_STORAGE_KEYS } from '@/database/database';

interface SettingsState {
  settings: Settings;
  setCurrency: (currency: string) => void;
  resetAllData: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: storage.get<Settings>(DB_STORAGE_KEYS.SETTINGS, {
    currency: '₹',
    currencyPosition: 'prefix',
  }),

  setCurrency: (currency: string) => {
    set((state) => {
      const updated: Settings = { ...state.settings, currency };
      storage.set(DB_STORAGE_KEYS.SETTINGS, updated);
      return { settings: updated };
    });
  },

  resetAllData: () => {
    storage.clearAll();
    window.location.reload();
  },
}));
