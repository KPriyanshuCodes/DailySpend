import React, { useState } from 'react';
import {
  Coins,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CURRENCY_OPTIONS } from '@/constants/defaults';
import { Category, Expense, Settings } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { AppLogo } from '@/components/AppLogo';

interface SettingsViewProps {
  settings: Settings;
  onSetCurrency: (currency: string) => void;
  onResetAllData: () => void;
  categories: Category[];
  expenses: Expense[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSetCurrency,
  onResetAllData,
  categories,
  expenses,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalLifetimeSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      categories,
      expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dailyspend-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.categories && parsed.expenses) {
          localStorage.setItem('dailyspend_categories_v1', JSON.stringify(parsed.categories));
          localStorage.setItem('dailyspend_expenses_v1', JSON.stringify(parsed.expenses));
          if (parsed.settings) {
            localStorage.setItem('dailyspend_settings_v1', JSON.stringify(parsed.settings));
          }
          showToast('Data imported successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* App Branding Card with Logo */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-white shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex items-center gap-4">
        <AppLogo className="w-13 h-13 shadow-xs" />
        <div className="flex flex-col">
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight leading-snug">
            DailySpend
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Personal Expense Tracker
          </p>
        </div>
      </div>

      {/* Currency Preference in Light Frosted Glass */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Coins className="w-5 h-5 text-[#B85D38]" />
          <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            Currency Symbol
          </h3>
        </div>
        <p className="text-xs text-stone-500">
          Choose the primary currency symbol displayed across the app.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CURRENCY_OPTIONS.map((c) => {
            const isSelected = settings.currency === c.symbol;
            return (
              <button
                key={c.code}
                onClick={() => onSetCurrency(c.symbol)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#B85D38] bg-[#B85D38]/10 text-[#B85D38] shadow-xs'
                    : 'border-stone-200/50 bg-white/60 text-stone-700 hover:bg-white'
                }`}
              >
                <span>{c.code}</span>
                <span className="text-base font-extrabold text-[#B85D38]">
                  {c.symbol}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage & Lifetime Stats in Light Frosted Glass */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-[#B85D38]" />
          <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            Storage & Health
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-stone-50/70 rounded-2xl p-3 text-center border border-stone-200/40">
            <span className="text-xs text-stone-400 font-semibold block">Categories</span>
            <span className="text-xl font-extrabold text-stone-900 mt-1 block">
              {categories.length}
            </span>
          </div>

          <div className="bg-stone-50/70 rounded-2xl p-3 text-center border border-stone-200/40">
            <span className="text-xs text-stone-400 font-semibold block">Total Logs</span>
            <span className="text-xl font-extrabold text-stone-900 mt-1 block">
              {expenses.length}
            </span>
          </div>

          <div className="bg-stone-50/70 rounded-2xl p-3 text-center border border-stone-200/40">
            <span className="text-xs text-stone-400 font-semibold block">Lifetime Total</span>
            <span className="text-base sm:text-lg font-extrabold text-stone-900 mt-1 block truncate">
              {formatCurrency(totalLifetimeSpent, settings.currency)}
            </span>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-white/70 hover:bg-white text-stone-700 hover:text-stone-900 text-xs font-bold border border-stone-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#B85D38]" />
            Export Backup (JSON)
          </button>

          <label className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-white/70 hover:bg-white text-stone-700 hover:text-stone-900 text-xs font-bold border border-stone-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
            <Upload className="w-4 h-4 text-[#B85D38]" />
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset All Data */}
      <div className="bg-rose-50/40 backdrop-blur-md rounded-3xl p-6 border border-rose-200/50 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            Reset All Data
          </h3>
        </div>
        <p className="text-xs text-rose-600/90 leading-relaxed font-normal">
          Permanently clear all expense entries and reset categories.
        </p>

        {showResetConfirm ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white text-stone-700 text-xs font-bold border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onResetAllData}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
            >
              Yes, Clear Everything
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-100/70 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-colors cursor-pointer border border-rose-200/50"
          >
            Clear All Data
          </button>
        )}
      </div>
    </div>
  );
};
