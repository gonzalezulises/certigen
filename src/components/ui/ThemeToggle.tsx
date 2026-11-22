'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();
  // Avoid hydration mismatch: false on server/first render, true after hydration
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center justify-center h-11 w-11 text-muted-foreground bg-card border border-border rounded-lg"
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
      className="flex items-center justify-center h-11 w-11 text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`${t('accessibility.toggleTheme')} - ${t('accessibility.currentTheme', { theme: getLabel() })}`}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
}
