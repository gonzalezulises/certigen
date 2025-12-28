'use client';

import { useTranslations } from 'next-intl';

export function OAuthDivider() {
  const t = useTranslations('auth');

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          {t('oauth.divider')}
        </span>
      </div>
    </div>
  );
}
