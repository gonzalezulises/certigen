'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Award, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('common.appName')} - {t('footer.tagline')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/validate`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('footer.validate')}
            </Link>
            <Link
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              {t('footer.github')}
            </Link>
          </div>
        </div>

        {/* Author Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('footer.developedBy')}{' '}
                <Link
                  href="https://ulises-gonzalez-site.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Ulises Gonzalez
                </Link>
              </p>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
              <Link
                href="https://rizo.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                Rizo.ma
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com/in/ulisesgonzalez/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://github.com/gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://medium.com/@gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Medium"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            © {currentYear} Ulises Gonzalez - Rizo.ma. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
