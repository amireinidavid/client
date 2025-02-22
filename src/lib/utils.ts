import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a price string with currency symbol
 * @param price - The price to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Example usage:
// formatPrice(29.99) => "$29.99"
// formatPrice(29.99, 'EUR', 'de-DE') => "29,99 €"
// formatPrice(29.99, 'GBP', 'en-GB') => "£29.99"
