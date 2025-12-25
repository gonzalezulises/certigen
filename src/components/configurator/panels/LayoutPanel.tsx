'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LayoutConfig, BorderConfig } from '@/lib/pdf/config/schema';
import { Label, Select, Switch } from '@/components/ui';

interface LayoutPanelProps {
  config: LayoutConfig;
  borderConfig: BorderConfig;
  onLayoutChange: (updates: Partial<LayoutConfig>) => void;
  onBorderChange: (updates: Partial<BorderConfig>) => void;
}

export function LayoutPanel({
  config,
  borderConfig,
  onLayoutChange,
  onBorderChange,
}: LayoutPanelProps) {
  const t = useTranslations('configurator.layout');

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Página */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('page')}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{t('paperSize')}</Label>
            <Select
              value={config.paperSize}
              onChange={(e) => onLayoutChange({ paperSize: e.target.value as 'A4' | 'LETTER' | 'LEGAL' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="A4">{t('paperSizeOptions.a4')}</option>
              <option value="LETTER">{t('paperSizeOptions.letter')}</option>
              <option value="LEGAL">{t('paperSizeOptions.legal')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('orientation')}</Label>
            <Select
              value={config.orientation}
              onChange={(e) => onLayoutChange({ orientation: e.target.value as 'landscape' | 'portrait' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="landscape">{t('orientationOptions.landscape')}</option>
              <option value="portrait">{t('orientationOptions.portrait')}</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Bordes */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('borders')}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{t('borderStyle')}</Label>
            <Select
              value={borderConfig.style}
              onChange={(e) => onBorderChange({ style: e.target.value as BorderConfig['style'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="none">{t('borderStyleOptions.none')}</option>
              <option value="simple">{t('borderStyleOptions.simple')}</option>
              <option value="double">{t('borderStyleOptions.double')}</option>
              <option value="certificate">{t('borderStyleOptions.certificate')}</option>
              <option value="ornate">{t('borderStyleOptions.ornate')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('borderWidth')}</Label>
            <Select
              value={borderConfig.width}
              onChange={(e) => onBorderChange({ width: e.target.value as 'thin' | 'medium' | 'thick' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="thin">{t('widthOptions.thin')}</option>
              <option value="medium">{t('widthOptions.medium')}</option>
              <option value="thick">{t('widthOptions.thick')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('corners')}</Label>
            <Select
              value={borderConfig.cornerStyle}
              onChange={(e) => onBorderChange({ cornerStyle: e.target.value as BorderConfig['cornerStyle'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="none">{t('cornerOptions.none')}</option>
              <option value="simple">{t('cornerOptions.simple')}</option>
              <option value="ornate">{t('cornerOptions.ornate')}</option>
              <option value="flourish">{t('cornerOptions.flourish')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('padding')}</Label>
            <Select
              value={borderConfig.padding}
              onChange={(e) => onBorderChange({ padding: e.target.value as 'compact' | 'normal' | 'spacious' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="compact">{t('paddingOptions.compact')}</option>
              <option value="normal">{t('paddingOptions.normal')}</option>
              <option value="spacious">{t('paddingOptions.spacious')}</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Posiciones */}
      <div>
        <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">{t('positions')}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{t('logoPosition')}</Label>
            <Select
              value={config.logoPosition}
              onChange={(e) => onLayoutChange({ logoPosition: e.target.value as LayoutConfig['logoPosition'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="top-left">{t('positionOptions.topLeft')}</option>
              <option value="top-center">{t('positionOptions.topCenter')}</option>
              <option value="top-right">{t('positionOptions.topRight')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('logoSize')}</Label>
            <Select
              value={config.logoSize}
              onChange={(e) => onLayoutChange({ logoSize: e.target.value as 'small' | 'medium' | 'large' })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="small">{t('sizeOptions.small')}</option>
              <option value="medium">{t('sizeOptions.medium')}</option>
              <option value="large">{t('sizeOptions.large')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('qrPosition')}</Label>
            <Select
              value={config.qrPosition}
              onChange={(e) => onLayoutChange({ qrPosition: e.target.value as LayoutConfig['qrPosition'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="bottom-left">{t('positionOptions.bottomLeft')}</option>
              <option value="bottom-center">{t('positionOptions.bottomCenter')}</option>
              <option value="bottom-right">{t('positionOptions.bottomRight')}</option>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{t('signaturePosition')}</Label>
            <Select
              value={config.signaturePosition}
              onChange={(e) => onLayoutChange({ signaturePosition: e.target.value as LayoutConfig['signaturePosition'] })}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="left">{t('signatureOptions.left')}</option>
              <option value="center">{t('signatureOptions.center')}</option>
              <option value="right">{t('signatureOptions.right')}</option>
              <option value="dual">{t('signatureOptions.dual')}</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Label className="text-sm">{t('showSignatureLine')}</Label>
          <Switch
            checked={config.showSignatureLine}
            onCheckedChange={(checked) => onLayoutChange({ showSignatureLine: checked })}
          />
        </div>
      </div>
    </div>
  );
}
