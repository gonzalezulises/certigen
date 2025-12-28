import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomBytes } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique certificate number with high entropy
 * Format: CER-{YYYYMMDD}-{RANDOM10CHARS}
 * Example: CER-20251228-A7X9K2M4NP
 *
 * Uses crypto.randomBytes for ~60 bits of entropy (vs ~20 bits before)
 * This makes certificate numbers practically impossible to enumerate
 */
export function generateCertificateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Generate 10 characters from base64url (60 bits of entropy)
  const random = randomBytes(8)
    .toString('base64url')
    .slice(0, 10)
    .toUpperCase();

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
 * Accepts both legacy (6 digits) and new format (10 alphanumeric)
 * Legacy: CER-YYYYMMDD-NNNNNN (e.g., CER-20240115-847362)
 * New: CER-YYYYMMDD-XXXXXXXXXX (e.g., CER-20251228-A7X9K2M4NP)
 */
export function isValidCertificateNumber(number: string): boolean {
  // Legacy format: 6 digits
  const legacyPattern = /^CER-\d{8}-\d{6}$/;
  // New format: 10 alphanumeric characters (base64url uppercase)
  const newPattern = /^CER-\d{8}-[A-Z0-9_-]{10}$/;

  return legacyPattern.test(number) || newPattern.test(number);
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
