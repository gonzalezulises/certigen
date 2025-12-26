import React from 'react';
import { pdf } from '@alexandernanberg/react-pdf-renderer';
import { TemplateConfig, TemplateId, CertificateData } from './config/schema';
import { templateDefinitions, getDefaultConfig } from './config/defaults';
import { getTemplate } from './templates';
import { generateQRDataURL, generateValidationURL } from './utils/qr-generator';
import { loadFonts } from './fonts/register';

// NOTE: Using @alexandernanberg/react-pdf-renderer for React 19 compatibility
// Fonts are registered lazily when loadFonts() is called

export interface GeneratePDFOptions {
  templateId: TemplateId;
  data: CertificateData;
  config?: Partial<TemplateConfig>;
  validationBaseUrl?: string;
}

export interface GeneratePDFResult {
  blob: Blob;
  dataUrl: string;
}

/**
 * Helper para hacer merge seguro de objetos
 * Evita errores cuando el objeto es undefined o null
 */
function safeObjectMerge<T>(
  base: T,
  overrides: Partial<T> | undefined | null
): T {
  if (!overrides || typeof overrides !== 'object') {
    return base;
  }
  try {
    const result = { ...base };
    for (const key in overrides) {
      const value = overrides[key];
      if (value !== undefined && value !== null) {
        (result as Record<string, unknown>)[key] = value;
      }
    }
    return result;
  } catch {
    return base;
  }
}

/**
 * Deep merge config con valores por defecto garantizados
 * Esto asegura que ningún valor sea undefined
 */
const mergeConfig = (
  base: TemplateConfig,
  overrides: Partial<TemplateConfig> | TemplateConfig | undefined
): TemplateConfig => {
  // Si no hay overrides, retornar base
  if (!overrides || typeof overrides !== 'object') {
    return base;
  }

  return {
    colors: safeObjectMerge(base.colors, overrides.colors),
    typography: safeObjectMerge(base.typography, overrides.typography),
    border: safeObjectMerge(base.border, overrides.border),
    ornaments: safeObjectMerge(base.ornaments, overrides.ornaments),
    layout: safeObjectMerge(base.layout, overrides.layout),
    content: safeObjectMerge(base.content, overrides.content),
    branding: safeObjectMerge(base.branding, overrides.branding),
  };
};

/**
 * Genera un PDF de certificado
 */
export const generateCertificatePDF = async (
  options: GeneratePDFOptions
): Promise<GeneratePDFResult> => {
  const {
    templateId,
    data,
    config: configOverrides = {},
    validationBaseUrl = process.env.NEXT_PUBLIC_VALIDATION_BASE_URL || '',
  } = options;

  // Preload fonts before generating PDF
  await loadFonts();

  // Obtener configuración base y aplicar overrides
  const baseConfig = getDefaultConfig(templateId);
  const finalConfig = mergeConfig(baseConfig, configOverrides);

  // Generar QR code
  let qrCodeDataUrl: string | undefined;
  if (finalConfig.content.showQR && data.certificate_number) {
    const validationUrl = generateValidationURL(validationBaseUrl, data.certificate_number);
    qrCodeDataUrl = await generateQRDataURL(validationUrl, {
      width: 200,
      color: {
        dark: finalConfig.colors.text,
        light: finalConfig.colors.background,
      },
    });
  }

  // Obtener componente de plantilla
  const TemplateComponent = getTemplate(templateId);

  // Generar PDF
  const document = (
    <TemplateComponent
      data={data}
      config={finalConfig}
      qrCodeDataUrl={qrCodeDataUrl}
    />
  );

  try {
    const blob = await pdf(document).toBlob();
    const dataUrl = await blobToDataUrl(blob);
    return { blob, dataUrl };
  } catch (error) {
    console.error('PDF generation failed:', error);
    console.error('Template ID:', templateId);
    throw error;
  }
};

/**
 * Genera múltiples PDFs (batch)
 */
export const generateCertificatePDFBatch = async (
  options: Omit<GeneratePDFOptions, 'data'> & { dataList: CertificateData[] }
): Promise<GeneratePDFResult[]> => {
  const { dataList, ...rest } = options;

  const results: GeneratePDFResult[] = [];

  for (const data of dataList) {
    const result = await generateCertificatePDF({ ...rest, data });
    results.push(result);
  }

  return results;
};

// Utilidad para convertir Blob a Data URL
const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Exportar tipos y utilidades
export { templateDefinitions, getDefaultConfig };
export type { TemplateConfig, TemplateId, CertificateData };
