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

/**
 * Format a date string into a more readable format
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}

/**
 * Format a currency value with proper currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code (default 'PHP')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Get the dashboard URL based on user role
 * @param roleId - User role ID
 * @returns Dashboard URL
 */
export function getDashboardUrl(roleId: number): string {
  switch (roleId) {
    case 5: // SUPERADMIN
    case 4: // ADMIN
      return '/admin/dashboard';
    case 3: // HOTEL_PROVIDER
      return '/provider/dashboard';
    case 2: // TRAVEL_AGENT
      return '/agent/dashboard';
    case 1: // CUSTOMER
    default:
      return '/account/dashboard';
  }
}
