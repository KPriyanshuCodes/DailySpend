export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

export function parseAmount(input: string): number {
  const sanitized = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
}
