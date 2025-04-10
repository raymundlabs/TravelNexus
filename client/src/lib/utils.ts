import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price value with Philippine Peso (₱) symbol
 * @param price - The price value to format (can be null)
 * @returns Formatted price string with ₱ symbol
 */
export function formatPrice(price: number | null): string {
  if (price === null) return '₱0';
  return `₱${price.toLocaleString('en-PH')}`
}
