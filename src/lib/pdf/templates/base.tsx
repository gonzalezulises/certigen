import React from 'react';
import { TemplateConfig, CertificateData } from '../config/schema';

export interface CertificateTemplateProps {
  data: CertificateData;
  config: TemplateConfig;
  qrCodeDataUrl?: string;
}

// Utilidad para formatear fecha
export const formatDate = (dateString: string, locale: string = 'es-ES'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Utilidad para obtener dimensiones de página
export const getPageDimensions = (
  paperSize: 'A4' | 'LETTER' | 'LEGAL',
  orientation: 'landscape' | 'portrait'
): { width: number; height: number } => {
  const dimensions = {
    A4: { width: 595.28, height: 841.89 },
    LETTER: { width: 612, height: 792 },
    LEGAL: { width: 612, height: 1008 },
  };

  const { width, height } = dimensions[paperSize];

  return orientation === 'landscape'
    ? { width: height, height: width }
    : { width, height };
};
