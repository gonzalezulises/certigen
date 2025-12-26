'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Award, FileCheck, Shield, Zap, Code2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-800/50 dark:bg-gray-700/50 px-4 py-2 rounded-full text-sm mb-6">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span>100% Open Source - MIT License</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>

            <p className="text-xl text-blue-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold gap-2">
                  <Award className="h-5 w-5" aria-hidden="true" />
                  {t('home.hero.cta')}
                </Button>
              </Link>
              <Link href="/validate">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                  <FileCheck className="h-5 w-5" aria-hidden="true" />
                  {t('validate.title')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-gray-900"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('home.features.qrVerification.title')}
              description={t('home.features.qrVerification.description')}
            />
            <FeatureCard
              icon={<FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('home.features.templates.title')}
              description={t('home.features.templates.description')}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('home.features.batch.title')}
              description={t('home.features.batch.description')}
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('home.features.email.title')}
              description={t('home.features.email.description')}
            />
            <FeatureCard
              icon={<Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('admin.api.title')}
              description={t('admin.api.description')}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title={t('home.features.qrVerification.title')}
              description={t('home.features.qrVerification.description')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 dark:bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('home.hero.cta')}
          </h2>
          <p className="text-blue-200 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 gap-2">
                <Award className="h-5 w-5" aria-hidden="true" />
                {t('home.hero.cta')}
              </Button>
            </Link>
            <a
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Code2 className="h-5 w-5" aria-hidden="true" />
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
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4" aria-hidden="true">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}
