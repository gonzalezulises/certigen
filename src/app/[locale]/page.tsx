'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Award, FileCheck, QrCode, Palette, FileSpreadsheet, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(37, 99, 235, 0.4), transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              100% Open Source · MIT License
            </span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-blue-100/80 md:text-xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={`/${locale}/generate`}>
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Award className="h-5 w-5" aria-hidden="true" />
                  {t('home.hero.cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/validate`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <FileCheck className="h-5 w-5" aria-hidden="true" />
                  {t('validate.title')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('home.features.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('home.hero.subtitle')}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={QrCode}
              title={t('home.features.qrVerification.title')}
              description={t('home.features.qrVerification.description')}
            />
            <FeatureCard
              icon={Palette}
              title={t('home.features.templates.title')}
              description={t('home.features.templates.description')}
            />
            <FeatureCard
              icon={FileSpreadsheet}
              title={t('home.features.batch.title')}
              description={t('home.features.batch.description')}
            />
            <FeatureCard
              icon={Mail}
              title={t('home.features.email.title')}
              description={t('home.features.email.description')}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 50% 120%, rgba(37, 99, 235, 0.35), transparent)',
          }}
        />
        <div className="container relative z-10 mx-auto px-4 py-20 text-center md:py-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('home.hero.cta')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100/70">{t('home.hero.subtitle')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${locale}/generate`}>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Award className="h-5 w-5" aria-hidden="true" />
                {t('home.hero.cta')}
              </Button>
            </Link>
            <a
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
                {t('footer.github')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
