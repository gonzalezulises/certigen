import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique certificate number
 * Format: CER-{YYYYMMDD}-{RANDOM6DIGITS}
 * Example: CER-20240115-847362
 */
export function generateCertificateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);

  return `CER-${year}${month}${day}-${random}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string = 'es-ES'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for short display
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Get validation URL for a certificate
 */
export function getValidationUrl(certificateNumber: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_VALIDATION_BASE_URL || 'http://localhost:3000/validate';
  return `${baseUrl}/${certificateNumber}`;
}

/**
 * Validate certificate number format
 */
export function isValidCertificateNumber(number: string): boolean {
  const pattern = /^CER-\d{8}-\d{6}$/;
  return pattern.test(number);
}

/**
 * Get certificate type label
 */
export function getCertificateTypeLabel(type: 'participation' | 'completion'): string {
  return type === 'participation' ? 'Participación' : 'Aprobación';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
