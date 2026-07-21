import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  CurrencyCode,
  CurrencyConfig,
  MAJOR_CURRENCIES,
  formatCurrency as baseFormatCurrency,
  getCurrencySymbol as baseGetCurrencySymbol } from
'../utils/currency';

export function useCurrency() {
  const currencyCode = useSelector((state: RootState) => state.settings.currency) as CurrencyCode;


  const config: CurrencyConfig = MAJOR_CURRENCIES[currencyCode] || MAJOR_CURRENCIES['INR'];

  const formatCurrency = (amount: number) => {
    return baseFormatCurrency(amount, config.code);
  };

  const getCurrencySymbol = () => {
    return baseGetCurrencySymbol(config.code);
  };

  return {
    currencyCode: config.code,
    currencyConfig: config,
    formatCurrency,
    getCurrencySymbol
  };
}