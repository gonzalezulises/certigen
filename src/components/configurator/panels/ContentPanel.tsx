'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ContentConfig } from '@/lib/pdf/config/schema';
import { Label, Input, Switch } from '@/components/ui';

interface ContentPanelProps {
  config: ContentConfig;
  onChange: (updates: Partial<ContentConfig>) => void;
}

export function ContentPanel({ config, onChange }: ContentPanelProps) {
  const t = useTranslations('configurator.content');

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Textos */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('texts')}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('headerText')}</Label>
            <Input
              value={config.headerText}
              onChange={(e) => onChange({ headerText: e.target.value })}
              placeholder="Certificado de Completación"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label className="text-xs">{t('subtitleTemplate')}</Label>
            <Input
              value={config.subtitleTemplate}
              onChange={(e) => onChange({ subtitleTemplate: e.target.value })}
              placeholder="Se certifica que"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label className="text-xs">{t('footerText')}</Label>
            <Input
              value={config.footerText || ''}
              onChange={(e) => onChange({ footerText: e.target.value || undefined })}
              placeholder="Texto adicional..."
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Campos visibles */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('fieldsToShow')}</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showSubtitle')}</Label>
            <Switch
              checked={config.showSubtitle}
              onCheckedChange={(checked) => onChange({ showSubtitle: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showOrganizationName')}</Label>
            <Switch
              checked={config.showOrganizationName}
              onCheckedChange={(checked) => onChange({ showOrganizationName: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showDate')}</Label>
            <Switch
              checked={config.showDate}
              onCheckedChange={(checked) => onChange({ showDate: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showInstructor')}</Label>
            <Switch
              checked={config.showInstructor}
              onCheckedChange={(checked) => onChange({ showInstructor: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showHours')}</Label>
            <Switch
              checked={config.showHours}
              onCheckedChange={(checked) => onChange({ showHours: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showGrade')}</Label>
            <Switch
              checked={config.showGrade}
              onCheckedChange={(checked) => onChange({ showGrade: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showCertificateNumber')}</Label>
            <Switch
              checked={config.showCertificateNumber}
              onCheckedChange={(checked) => onChange({ showCertificateNumber: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('showQR')}</Label>
            <Switch
              checked={config.showQR}
              onCheckedChange={(checked) => onChange({ showQR: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
