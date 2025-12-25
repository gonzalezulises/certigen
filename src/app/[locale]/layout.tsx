import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Noto_Sans_Hebrew } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtlLocale, type Locale } from '@/i18n/config';
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
});

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'CertiGen - Verifiable Certificate System',
    es: 'CertiGen - Sistema de Certificados Verificables',
    de: 'CertiGen - Verifizierbares Zertifikatsystem',
    it: 'CertiGen - Sistema di Certificati Verificabili',
    pl: 'CertiGen - System Weryfikowalnych Certyfikatow',
    ru: 'CertiGen - Система Верифицируемых Сертификатов',
    hu: 'CertiGen - Ellenorizheto Tanusitvany Rendszer',
    he: 'CertiGen - מערכת תעודות מאומתות',
    th: 'CertiGen - ระบบใบรับรองที่ตรวจสอบได้',
  };

  const descriptions: Record<string, string> = {
    en: 'Generate professional digital certificates with unique QR codes for instant validation. Perfect for courses, workshops, and educational programs.',
    es: 'Genera certificados digitales profesionales con codigo QR unico para validacion instantanea. Perfecto para cursos, talleres y programas educativos.',
    de: 'Erstellen Sie professionelle digitale Zertifikate mit einzigartigen QR-Codes zur sofortigen Validierung.',
    it: 'Genera certificati digitali professionali con codici QR unici per la validazione istantanea.',
    pl: 'Generuj profesjonalne certyfikaty cyfrowe z unikalnymi kodami QR do natychmiastowej weryfikacji.',
    ru: 'Создавайте профессиональные цифровые сертификаты с уникальными QR-кодами для мгновенной проверки.',
    hu: 'Keszitsen professzionalis digitalis tanusitvanyokat egyedi QR-kodokkal az azonnali ellenorzeshez.',
    he: 'צור תעודות דיגיטליות מקצועיות עם קודי QR ייחודיים לאימות מיידי.',
    th: 'สร้างใบรับรองดิจิทัลมืออาชีพพร้อมรหัส QR เฉพาะสำหรับการตรวจสอบทันที',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: ["certificates", "validation", "qr code", "education", "courses"],
    authors: [{ name: "CertiGen" }],
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  // Determine text direction
  const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr';

  // Determine font class based on locale
  const getFontClass = () => {
    if (locale === 'th') return notoSansThai.variable;
    if (locale === 'he') return notoSansHebrew.variable;
    return inter.variable;
  };

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${getFontClass()} font-sans antialiased bg-white dark:bg-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
            >
              {locale === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
            </a>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main id="main-content" role="main" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
