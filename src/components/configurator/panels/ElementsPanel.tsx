'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { OrnamentConfig } from '@/lib/pdf/config/schema';
import { Label, Select, Switch, Slider } from '@/components/ui';

interface ElementsPanelProps {
  config: OrnamentConfig;
  onChange: (updates: Partial<OrnamentConfig>) => void;
}

export function ElementsPanel({ config, onChange }: ElementsPanelProps) {
  const t = useTranslations('configurator.elements');

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Divisores */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('dividers')}</h4>
        <div>
          <Label className="text-xs">{t('dividerStyle')}</Label>
          <Select
            value={config.dividerStyle}
            onChange={(e) => onChange({ dividerStyle: e.target.value as OrnamentConfig['dividerStyle'] })}
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="none">{t('dividerOptions.none')}</option>
            <option value="simple">{t('dividerOptions.simple')}</option>
            <option value="ornate">{t('dividerOptions.ornate')}</option>
            <option value="dots">{t('dividerOptions.dots')}</option>
            <option value="gradient">{t('dividerOptions.gradient')}</option>
          </Select>
        </div>
      </div>

      {/* Sello */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">{t('seal')}</h4>
          <Switch
            checked={config.showSeal}
            onCheckedChange={(checked) => onChange({ showSeal: checked })}
          />
        </div>

        {config.showSeal && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t('sealStyle')}</Label>
              <Select
                value={config.sealStyle}
                onChange={(e) => onChange({ sealStyle: e.target.value as OrnamentConfig['sealStyle'] })}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="classic">{t('sealStyleOptions.classic')}</option>
                <option value="modern">{t('sealStyleOptions.modern')}</option>
                <option value="ribbon">{t('sealStyleOptions.ribbon')}</option>
                <option value="badge">{t('sealStyleOptions.badge')}</option>
              </Select>
            </div>

            <div>
              <Label className="text-xs">{t('sealPosition')}</Label>
              <Select
                value={config.sealPosition}
                onChange={(e) => onChange({ sealPosition: e.target.value as OrnamentConfig['sealPosition'] })}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="bottom-center">Abajo centro</option>
                <option value="bottom-right">Abajo derecha</option>
                <option value="top-right">Arriba derecha</option>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Fondo */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('background')}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('backgroundPattern')}</Label>
            <Select
              value={config.backgroundPattern}
              onChange={(e) => onChange({ backgroundPattern: e.target.value as OrnamentConfig['backgroundPattern'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="none">{t('patternOptions.none')}</option>
              <option value="subtle-grid">{t('patternOptions.subtleGrid')}</option>
              <option value="diagonal-lines">{t('patternOptions.diagonalLines')}</option>
              <option value="watermark">{t('patternOptions.watermark')}</option>
            </Select>
          </div>

          {config.backgroundPattern !== 'none' && (
            <div>
              <Label className="text-xs">
                {t('backgroundOpacity')}: {Math.round(config.backgroundOpacity * 100)}%
              </Label>
              <Slider
                value={[config.backgroundOpacity]}
                onValueChange={([value]) => onChange({ backgroundOpacity: value })}
                min={0}
                max={0.3}
                step={0.01}
                className="py-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
