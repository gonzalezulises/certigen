export const locales = ['en', 'de', 'nl', 'pl', 'ru', 'es', 'he', 'hu', 'it', 'th'] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['he'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  es: 'Español',
  he: 'עברית',
  hu: 'Magyar',
  it: 'Italiano',
  th: 'ไทย'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  de: '🇩🇪',
  nl: '🇳🇱',
  pl: '🇵🇱',
  ru: '🇷🇺',
  es: '🇪🇸',
  he: '🇮🇱',
  hu: '🇭🇺',
  it: '🇮🇹',
  th: '🇹🇭'
};

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
