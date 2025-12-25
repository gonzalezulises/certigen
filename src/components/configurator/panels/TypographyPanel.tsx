'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { TypographyConfig, FontFamily } from '@/lib/pdf/config/schema';
import { Label, Select } from '@/components/ui';

interface TypographyPanelProps {
  config: TypographyConfig;
  onChange: (updates: Partial<TypographyConfig>) => void;
}

export function TypographyPanel({ config, onChange }: TypographyPanelProps) {
  const t = useTranslations('configurator.typography');

  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: 'serif', label: t('fontOptions.serif') },
    { value: 'sans', label: t('fontOptions.sans') },
    { value: 'script', label: t('fontOptions.script') },
    { value: 'slab', label: t('fontOptions.slab') },
    { value: 'display', label: t('fontOptions.display') },
  ];

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Fuentes */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('fonts')}</h4>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label className="text-xs">{t('titleFont')}</Label>
            <Select
              value={config.titleFont}
              onChange={(e) => onChange({ titleFont: e.target.value as FontFamily })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {fontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('bodyFont')}</Label>
            <Select
              value={config.bodyFont}
              onChange={(e) => onChange({ bodyFont: e.target.value as FontFamily })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {fontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('nameFont')}</Label>
            <Select
              value={config.accentFont}
              onChange={(e) => onChange({ accentFont: e.target.value as FontFamily })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {fontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Estilo */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('style')}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{t('scale')}</Label>
            <Select
              value={config.scale}
              onChange={(e) => onChange({ scale: e.target.value as 'compact' | 'normal' | 'spacious' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="compact">{t('scaleOptions.compact')}</option>
              <option value="normal">{t('scaleOptions.normal')}</option>
              <option value="spacious">{t('scaleOptions.spacious')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('alignment')}</Label>
            <Select
              value={config.alignment}
              onChange={(e) => onChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="left">{t('alignmentOptions.left')}</option>
              <option value="center">{t('alignmentOptions.center')}</option>
              <option value="right">{t('alignmentOptions.right')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('titleWeight')}</Label>
            <Select
              value={config.titleWeight}
              onChange={(e) => onChange({ titleWeight: e.target.value as 'normal' | 'medium' | 'bold' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="normal">{t('weightOptions.normal')}</option>
              <option value="medium">{t('weightOptions.medium')}</option>
              <option value="bold">{t('weightOptions.bold')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('nameWeight')}</Label>
            <Select
              value={config.nameWeight}
              onChange={(e) => onChange({ nameWeight: e.target.value as 'normal' | 'medium' | 'bold' | 'black' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="normal">{t('weightOptions.normal')}</option>
              <option value="medium">{t('weightOptions.medium')}</option>
              <option value="bold">{t('weightOptions.bold')}</option>
              <option value="black">{t('weightOptions.black')}</option>
            </Select>
          </div>

          <div className="col-span-2">
            <Label className="text-xs">{t('titleTransform')}</Label>
            <Select
              value={config.titleTransform}
              onChange={(e) => onChange({ titleTransform: e.target.value as 'none' | 'uppercase' | 'capitalize' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="none">{t('transformOptions.none')}</option>
              <option value="uppercase">{t('transformOptions.uppercase')}</option>
              <option value="capitalize">{t('transformOptions.capitalize')}</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
