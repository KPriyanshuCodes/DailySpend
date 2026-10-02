import { Expense, Category, MonthlySummary, CategorySummary } from '@/types';
import { formatMonthLabel, getDaysInMonth, getMonthKey } from './date';

export function calculateMonthlySummary(
  monthKey: string,
  allExpenses: Expense[],
  allCategories: Category[]
): MonthlySummary {
  const monthExpenses = allExpenses.filter(e => e.monthKey === monthKey);
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const transactionCount = monthExpenses.length;

  const categoryMap = new Map<string, Category>();
  allCategories.forEach(c => categoryMap.set(c.id, c));

  // Category totals
  const catTotalMap = new Map<string, { total: number; count: number }>();
  monthExpenses.forEach(e => {
    const existing = catTotalMap.get(e.categoryId) || { total: 0, count: 0 };
    catTotalMap.set(e.categoryId, {
      total: existing.total + e.amount,
      count: existing.count + 1,
    });
  });

  const categories: CategorySummary[] = Array.from(catTotalMap.entries())
    .map(([catId, data]) => {
      const cat = categoryMap.get(catId);
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

  // Highest spending category
  let highestCategory = undefined;
  if (categories.length > 0 && categories[0].totalAmount > 0) {
    highestCategory = {
      name: categories[0].categoryName,
      amount: categories[0].totalAmount,
      percentage: categories[0].percentage,
      icon: categories[0].categoryIcon,
      color: categories[0].categoryColor,
    };
  }

  // Daily average
  const daysInMonth = getDaysInMonth(monthKey);
  const currentKey = getMonthKey();
  let daysDivisor = daysInMonth;
  if (monthKey === currentKey) {
    daysDivisor = Math.max(1, new Date().getDate());
  }
  const dailyAverage = totalSpent > 0 ? Math.round((totalSpent / daysDivisor) * 10) / 10 : 0;

  return {
    monthKey,
    monthLabel: formatMonthLabel(monthKey),
    totalSpent,
    transactionCount,
    dailyAverage,
    daysInMonth,
    highestCategory,
    categories,
  };
}
