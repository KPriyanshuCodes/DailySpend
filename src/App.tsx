import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Tag,
  PieChart,
  Settings as SettingsIcon,
  Plus,
  Wallet,
} from 'lucide-react';
import { runInitialMigrations } from '@/database/migrations';
import { useCategoryStore } from '@/features/categories/categoryStore';
import { useExpenseStore } from '@/features/expenses/expenseStore';
import { useSettingsStore } from '@/features/settings/settingsStore';
import { calculateMonthlySummary } from '@/utils/calculations';
import { expenseRepository } from '@/database/expenseRepository';
import { Expense, Category } from '@/types';

// Views
import { DashboardView } from '@/views/DashboardView';
import { CategoriesView } from '@/views/CategoriesView';
import { SummaryView } from '@/views/SummaryView';
import { SettingsView } from '@/views/SettingsView';

// Modals
import { ExpenseModal } from '@/components/ExpenseModal';
import { CategoryModal } from '@/components/CategoryModal';
import { CategoryHistoryModal } from '@/components/CategoryHistoryModal';
import { AppLogo } from '@/components/AppLogo';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'summary' | 'settings'>('dashboard');

  // Stores
  const { categories, loadCategories, createCategory, updateCategory, toggleActive, deleteCategory, getUsageCount } =
    useCategoryStore();
  const { expenses, selectedMonthKey, loadExpenses, setSelectedMonthKey, addExpense, updateExpense, deleteExpense } =
    useExpenseStore();
  const { settings, setCurrency, resetAllData } = useSettingsStore();

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [initialCategoryIdForExpense, setInitialCategoryIdForExpense] = useState<string | undefined>(undefined);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Category Expense History modal state
  const [categoryForHistory, setCategoryForHistory] = useState<Category | null>(null);

  // Initialize DB on mount
  useEffect(() => {
    runInitialMigrations();
    loadCategories();
    loadExpenses();
  }, []);

  // Compute live aggregations for current selected month
  const monthlySummary = calculateMonthlySummary(selectedMonthKey, expenses, categories);
  const currentMonthExpenses = expenses.filter((e) => e.monthKey === selectedMonthKey);
  const availableMonthKeys = expenseRepository.getAvailableMonthKeys();

  // Handlers for expense
  const handleOpenAddExpense = (catId?: string) => {
    setEditingExpense(null);
    setInitialCategoryIdForExpense(catId);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setInitialCategoryIdForExpense(undefined);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (data: { amount: number; categoryId: string; date: string; note?: string }) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      deleteExpense(id);
    }
  };

  // Handlers for category
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (data: { name: string; icon: string; color: string }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
      // If currently viewing history for this category, keep it updated
      if (categoryForHistory && categoryForHistory.id === editingCategory.id) {
        setCategoryForHistory({ ...categoryForHistory, ...data });
      }
    } else {
      createCategory(data);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const res = deleteCategory(id);
    if (!res.success && res.error) {
      alert(res.error);
    } else if (categoryForHistory && categoryForHistory.id === id) {
      setCategoryForHistory(null);
    }
  };

  const handleOpenCategoryHistory = (cat: Category) => {
    setCategoryForHistory(cat);
  };

  const handleOpenCategoryHistoryById = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      setCategoryForHistory(cat);
    }
  };

  const hasActiveCategories = categories.some((c) => c.isActive);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex justify-center selection:bg-[#B85D38] selection:text-white relative overflow-x-hidden">
      {/* Subtle warm ambient background glow for glassmorphism */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-100/30 via-orange-50/15 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-lg min-h-screen bg-[#FAF8F5]/80 border-x border-stone-200/50 flex flex-col relative shadow-[0_10px_40px_rgba(28,25,23,0.03)] backdrop-blur-2xl">
        {/* Top Header with Light Glass */}
        <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-stone-200/50 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo className="w-9 h-9 shadow-xs" />
            <div>
              <h1 className="text-base font-extrabold text-stone-900 tracking-tight leading-tight">
                DailySpend
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => (hasActiveCategories ? handleOpenAddExpense() : handleOpenAddCategory())}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B85D38] hover:bg-[#A24E2B] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-3" />
              <span>{hasActiveCategories ? 'Add' : 'New Cat'}</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              summary={monthlySummary}
              recentExpenses={currentMonthExpenses.slice(0, 10)}
              currency={settings.currency}
              selectedMonthKey={selectedMonthKey}
              onSelectMonth={setSelectedMonthKey}
              availableMonthKeys={availableMonthKeys}
              hasCategories={hasActiveCategories}
              onAddExpense={() => handleOpenAddExpense()}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onNavigateToSummary={() => setActiveTab('summary')}
              onNavigateToCategories={() => setActiveTab('categories')}
              onViewCategoryHistory={handleOpenCategoryHistoryById}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              categories={categories}
              getUsageCount={getUsageCount}
              onCreateCategory={handleOpenAddCategory}
              onEditCategory={handleOpenEditCategory}
              onToggleActive={toggleActive}
              onDeleteCategory={handleDeleteCategory}
              onViewHistory={handleOpenCategoryHistory}
            />
          )}

          {activeTab === 'summary' && (
            <SummaryView
              summary={monthlySummary}
              monthExpenses={currentMonthExpenses}
              currency={settings.currency}
              selectedMonthKey={selectedMonthKey}
              onSelectMonth={setSelectedMonthKey}
              availableMonthKeys={availableMonthKeys}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onViewCategoryHistory={handleOpenCategoryHistoryById}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSetCurrency={setCurrency}
              onResetAllData={resetAllData}
              categories={categories}
              expenses={expenses}
            />
          )}
        </main>

        {/* Bottom Navigation Bar with Light Glass */}
        <nav className="sticky bottom-0 z-30 bg-white/80 backdrop-blur-xl border-t border-stone-200/50 px-3 py-2 flex items-center justify-around shadow-[0_-4px_24px_rgba(28,25,23,0.02)]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#B85D38] font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 font-medium'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'text-[#B85D38] font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 font-medium'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'text-[#B85D38] font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 font-medium'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'text-[#B85D38] font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 font-medium'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Settings</span>
          </button>
        </nav>

        {/* Expense Modal */}
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleSaveExpense}
          categories={categories}
          editingExpense={editingExpense}
          currency={settings.currency}
          initialCategoryId={initialCategoryIdForExpense}
          onCreateCategory={createCategory}
        />

        {/* Category Modal */}
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
        />

        {/* Category Expense History Modal */}
        <CategoryHistoryModal
          isOpen={!!categoryForHistory}
          onClose={() => setCategoryForHistory(null)}
          category={categoryForHistory}
          expenses={expenses}
          currency={settings.currency}
          onAddExpenseForCategory={(catId) => handleOpenAddExpense(catId)}
          onEditExpense={handleOpenEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </div>
  );
};

export default App;
