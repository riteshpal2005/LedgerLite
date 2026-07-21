



export type CurrencyCode =

'USD' | 'CAD' | 'MXN' |

'BRL' | 'ARS' | 'COP' | 'CLP' | 'PEN' |

'EUR' | 'GBP' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'RUB' |

'JPY' | 'CNY' | 'INR' | 'KRW' | 'SGD' | 'HKD' | 'TWD' | 'IDR' | 'MYR' | 'THB' | 'VND' | 'PHP' |

'AED' | 'SAR' | 'ILS' | 'TRY' | 'QAR' |

'ZAR' | 'EGP' | 'NGN' | 'KES' | 'GHS' |

'AUD' | 'NZD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

export const MAJOR_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {

  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', flag: '🇺🇸' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', flag: '🇨🇦' },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX', flag: '🇲🇽' },


  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', flag: '🇧🇷' },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR', flag: '🇦🇷' },
  COP: { code: 'COP', symbol: '$', name: 'Colombian Peso', locale: 'es-CO', flag: '🇨🇴' },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL', flag: '🇨🇱' },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE', flag: '🇵🇪' },


  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', flag: '🇬🇧' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH', flag: '🇨🇭' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE', flag: '🇸🇪' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO', flag: '🇳🇴' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK', flag: '🇩🇰' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL', flag: '🇵🇱' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ', flag: '🇨🇿' },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU', flag: '🇭🇺' },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', locale: 'ro-RO', flag: '🇷🇴' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU', flag: '🇷🇺' },


  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', flag: '🇯🇵' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', flag: '🇨🇳' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', flag: '🇮🇳' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR', flag: '🇰🇷' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', flag: '🇸🇬' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK', flag: '🇭🇰' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', locale: 'zh-TW', flag: '🇹🇼' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID', flag: '🇮🇩' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY', flag: '🇲🇾' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH', flag: '🇹🇭' },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN', flag: '🇻🇳' },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH', flag: '🇵🇭' },


  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA', flag: '🇸🇦' },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel', locale: 'he-IL', flag: '🇮🇱' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR', flag: '🇹🇷' },
  QAR: { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', locale: 'ar-QA', flag: '🇶🇦' },


  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA', flag: '🇿🇦' },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', locale: 'ar-EG', flag: '🇪🇬' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG', flag: '🇳🇬' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE', flag: '🇰🇪' },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', locale: 'en-GH', flag: '🇬🇭' },


  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', flag: '🇦🇺' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ', flag: '🇳🇿' }
};

export const POPULAR_CURRENCIES: CurrencyCode[] = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];




export function getCurrencySymbol(code: string): string {
  if (code in MAJOR_CURRENCIES) {
    return MAJOR_CURRENCIES[code as CurrencyCode].symbol;
  }
  return '₹';
}





export const formatCurrency = (amount: number, code: string = 'INR'): string => {
  const currencyConfig = MAJOR_CURRENCIES[code as CurrencyCode] || MAJOR_CURRENCIES['INR'];


  const isZeroDecimal = ['JPY', 'KRW', 'VND', 'CLP', 'IDR'].includes(currencyConfig.code);

  const formatter = new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2
  });
  return formatter.format(amount);
};