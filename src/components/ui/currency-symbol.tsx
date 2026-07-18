import React from 'react';
import { Text, View, ViewProps, TextProps } from 'react-native';
import { getCurrencySymbol } from '../../utils/currency';

interface CurrencySymbolProps extends ViewProps {
  code?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost';
  color?: string;
  textProps?: TextProps;
}

/**
 * A UI component that displays a currency symbol mimicking an icon.
 */
export function CurrencySymbol({
  code = 'INR',
  size = 'md',
  variant = 'solid',
  color = '#6642f8', // primary brand color
  className = '',
  textProps,
  ...viewProps
}: CurrencySymbolProps) {
  const symbol = getCurrencySymbol(code);

  const sizeStyles = {
    sm: { container: 'w-6 h-6 rounded-md', text: 'text-xs' },
    md: { container: 'w-8 h-8 rounded-lg', text: 'text-sm' },
    lg: { container: 'w-12 h-12 rounded-xl', text: 'text-xl' },
    xl: { container: 'w-16 h-16 rounded-2xl', text: 'text-3xl' },
  }[size];

  const variantStyles = {
    solid: {
      container: `bg-[${color}]`,
      text: 'text-white',
    },
    outline: {
      container: `border border-[${color}] bg-transparent`,
      text: `text-[${color}]`,
    },
    ghost: {
      container: 'bg-transparent',
      text: `text-[${color}]`,
    },
  }[variant];

  return (
    <View
      className={`items-center justify-center ${sizeStyles.container} ${variantStyles.container} ${className}`}
      {...viewProps}
    >
      <Text 
        className={`font-bold ${sizeStyles.text} ${variantStyles.text} ${textProps?.className || ''}`}
        {...textProps}
      >
        {symbol}
      </Text>
    </View>
  );
}
