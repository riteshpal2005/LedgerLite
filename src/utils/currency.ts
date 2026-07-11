/**
 * Standardized currency formatting utility for the entire app.
 * Uses the Indian numbering system format (lakhs, crores).
 * E.g., 1,23,456.00 instead of 123456.00
 */

export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Convenience method to format a number as INR.
 * Example: formatCurrency(1234.5) -> "₹1,234.50"
 */
export const formatCurrency = (amount: number): string => {
  return INR.format(amount);
};
