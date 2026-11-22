'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Award, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">
              {t('common.appName')} - {t('footer.tagline')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/validate`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.validate')}
            </Link>
            <Link
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              {t('footer.github')}
            </Link>
          </div>
        </div>

        {/* Author Section */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-sm text-muted-foreground">
                {t('footer.developedBy')}{' '}
                <Link
                  href="https://ulises-gonzalez-site.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  Ulises Gonzalez
                </Link>
              </p>
              <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
              <Link
                href="https://rizo.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
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
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://github.com/gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://medium.com/@gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Medium"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            © {currentYear} Ulises Gonzalez - Rizo.ma. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
