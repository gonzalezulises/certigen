'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        aria-label={t('accessibility.toggleTheme')}
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-5 w-5" aria-hidden="true" />;
    }
    if (resolvedTheme === 'dark') {
      return <Moon className="h-5 w-5" aria-hidden="true" />;
    }
    return <Sun className="h-5 w-5" aria-hidden="true" />;
  };

  const getLabel = () => {
    if (theme === 'system') return t('theme.system');
    if (theme === 'dark') return t('theme.dark');
    return t('theme.light');
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`${t('accessibility.toggleTheme')} - ${t('accessibility.currentTheme', { theme: getLabel() })}`}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
}
