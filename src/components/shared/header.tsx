'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Award, FileCheck, Home, Settings, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LanguageSelector, ThemeToggle } from '@/components/ui';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Remove locale prefix from pathname for comparison
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  const navigation = [
    { name: t('navigation.home'), href: `/${locale}`, icon: Home },
    { name: t('navigation.generate'), href: `/${locale}/generate`, icon: Award },
    { name: t('navigation.validate'), href: `/${locale}/validate`, icon: FileCheck },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    const hrefPath = href.replace(`/${locale}`, '') || '/';
    if (hrefPath === '/') return pathWithoutLocale === '/';
    return pathWithoutLocale.startsWith(hrefPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2" aria-label={t('common.appName')}>
            <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label={t('navigation.main')}>
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}

            {/* Auth-dependent navigation */}
            {!loading && (
              user ? (
                <>
                  <Link
                    href={`/${locale}/admin`}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                      pathWithoutLocale.startsWith('/admin') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                    )}
                    aria-current={pathWithoutLocale.startsWith('/admin') ? 'page' : undefined}
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    {t('navigation.admin')}
                  </Link>
                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <User className="h-4 w-4" aria-hidden="true" />
                      {user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label={t('navigation.logout')}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href={`/${locale}/admin/auth`}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathWithoutLocale.startsWith('/admin') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  {t('navigation.login')}
                </Link>
              )
            )}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

            {/* Language and Theme */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile menu button and controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
            role="navigation"
            aria-label={t('navigation.main')}
          >
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Auth buttons for mobile */}
              {!loading && (
                user ? (
                  <>
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        pathWithoutLocale.startsWith('/admin')
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                      aria-current={pathWithoutLocale.startsWith('/admin') ? 'page' : undefined}
                    >
                      <Settings className="h-5 w-5" aria-hidden="true" />
                      {t('navigation.admin')}
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <User className="h-4 w-4" aria-hidden="true" />
                          {user.email}
                        </span>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          {t('navigation.logout')}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/admin/auth`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      pathWithoutLocale.startsWith('/admin')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    {t('navigation.login')}
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
