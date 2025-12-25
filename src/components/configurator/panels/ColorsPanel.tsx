'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ColorConfig, colorPalettes } from '@/lib/pdf/config/schema';
import { Label, Input } from '@/components/ui';

interface ColorsPanelProps {
  config: ColorConfig;
  onChange: (updates: Partial<ColorConfig>) => void;
}

export function ColorsPanel({ config, onChange }: ColorsPanelProps) {
  const t = useTranslations('configurator.colors');

  const colorKeys: Array<keyof ColorConfig> = [
    'primary',
    'secondary',
    'accent',
    'background',
    'text',
    'textMuted',
    'border',
  ];

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
      {/* Paletas predefinidas */}
      <div>
        <Label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
          {t('palettes')}
        </Label>
        <div className="flex flex-wrap gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => onChange(palette.colors)}
              className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="flex -space-x-1">
                {[palette.colors.primary, palette.colors.secondary, palette.colors.accent].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selectores individuales */}
      <div className="grid grid-cols-2 gap-4">
        {colorKeys.map((key) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key} className="text-xs">
              {t(key)}
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config[key]}
                onChange={(e) => onChange({ [key]: e.target.value })}
                className="w-10 h-9 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <Input
                id={key}
                value={config[key]}
                onChange={(e) => onChange({ [key]: e.target.value })}
                className="font-mono text-xs flex-1"
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
