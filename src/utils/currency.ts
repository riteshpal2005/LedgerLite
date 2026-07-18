/**
 * Standardized currency formatting utility for the entire app.
 */

export type CurrencyCode = 
  | 'USD' // US Dollar
  | 'EUR' // Euro
  | 'GBP' // British Pound
  | 'INR' // Indian Rupee
  | 'JPY' // Japanese Yen
  | 'AUD' // Australian Dollar
  | 'CAD' // Canadian Dollar
  | 'CHF' // Swiss Franc
  | 'CNY' // Chinese Yuan
  | 'SGD' // Singapore Dollar
  | 'NZD' // New Zealand Dollar
  | 'ZAR' // South African Rand
  | 'BRL' // Brazilian Real
  | 'RUB'; // Russian Ruble

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const MAJOR_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
};

/**
 * Returns the symbol for a given currency code. Defaults to '₹' if unknown, to keep backwards compatibility.
 */
export function getCurrencySymbol(code: string): string {
  if (code in MAJOR_CURRENCIES) {
    return MAJOR_CURRENCIES[code as CurrencyCode].symbol;
  }
  return '₹'; // Default fallback
}

/**
 * Convenience method to format a number into a currency string based on currency code.
 * Example: formatCurrency(1234.5, 'USD') -> "$1,234.50"
 */
export const formatCurrency = (amount: number, code: string = 'INR'): string => {
  const currencyConfig = MAJOR_CURRENCIES[code as CurrencyCode] || MAJOR_CURRENCIES['INR'];
  const formatter = new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};
