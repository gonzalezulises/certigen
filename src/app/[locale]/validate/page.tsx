'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CertificateValidator } from '@/components/certificate';
import { FileCheck, QrCode, Hash, Shield } from 'lucide-react';

export default function ValidatePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('validate.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('validate.subtitle')}
          </p>
        </div>

        <CertificateValidator />

        {/* How it works */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            {t('validate.scan.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <QrCode className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('validate.scan.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('validate.scan.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <Hash className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('validate.placeholder')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('validate.subtitle')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <Shield className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('validate.button')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('validate.results.valid')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
