'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { BrandingConfig } from '@/lib/pdf/config/schema';
import { Label, Input, Button } from '@/components/ui';
import { Upload, X } from 'lucide-react';

interface BrandingPanelProps {
  config: BrandingConfig;
  onChange: (updates: Partial<BrandingConfig>) => void;
}

export function BrandingPanel({ config, onChange }: BrandingPanelProps) {
  const t = useTranslations('configurator.branding');

  const handleFileUpload = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      field: 'logoUrl' | 'signatureImage' | 'secondSignatureImage'
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Convertir a base64 para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const clearFile = useCallback(
    (field: 'logoUrl' | 'signatureImage' | 'secondSignatureImage') => {
      onChange({ [field]: undefined });
    },
    [onChange]
  );

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Organización */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('organization')}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('organizationName')}</Label>
            <Input
              value={config.organizationName}
              onChange={(e) => onChange({ organizationName: e.target.value })}
              placeholder="Mi Empresa S.A."
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label className="text-xs">{t('organizationSubtitle')}</Label>
            <Input
              value={config.organizationSubtitle || ''}
              onChange={(e) => onChange({ organizationSubtitle: e.target.value || undefined })}
              placeholder="Centro de Formación Profesional"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('logo')}</h4>
        <div>
          {config.logoUrl ? (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <img
                src={config.logoUrl}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFile('logoUrl')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('uploadLogo')}</span>
            </label>
          )}
        </div>
      </div>

      {/* Firma principal */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('signature')}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('signatureLabel')}</Label>
            <Input
              value={config.signatureLabel}
              onChange={(e) => onChange({ signatureLabel: e.target.value })}
              placeholder="Director Académico"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {config.signatureImage ? (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <img
                src={config.signatureImage}
                alt="Firma"
                className="h-10 w-auto object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFile('signatureImage')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'signatureImage')}
                className="hidden"
              />
              <Upload className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('uploadSignature')}</span>
            </label>
          )}
        </div>
      </div>

      {/* Segunda firma */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('secondSignature')}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('secondSignatureLabel')}</Label>
            <Input
              value={config.secondSignatureLabel || ''}
              onChange={(e) => onChange({ secondSignatureLabel: e.target.value || undefined })}
              placeholder="Coordinador de Programa"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {config.secondSignatureImage ? (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <img
                src={config.secondSignatureImage}
                alt="Segunda firma"
                className="h-10 w-auto object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFile('secondSignatureImage')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'secondSignatureImage')}
                className="hidden"
              />
              <Upload className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('uploadSignature')}</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
