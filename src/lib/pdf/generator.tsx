import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { TemplateConfig, TemplateId, CertificateData } from './config/schema';
import { templateDefinitions, getDefaultConfig } from './config/defaults';
import { getTemplate } from './templates';
import { generateQRDataURL, generateValidationURL } from './utils/qr-generator';
import { registerFonts } from './fonts/register';

// Registrar fuentes al cargar el módulo
registerFonts();

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
 * Merge partial config with base config
 */
const mergeConfig = (
  base: TemplateConfig,
  overrides: Partial<TemplateConfig>
): TemplateConfig => {
  return {
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    border: { ...base.border, ...overrides.border },
    ornaments: { ...base.ornaments, ...overrides.ornaments },
    layout: { ...base.layout, ...overrides.layout },
    content: { ...base.content, ...overrides.content },
    branding: { ...base.branding, ...overrides.branding },
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

  const blob = await pdf(document).toBlob();
  const dataUrl = await blobToDataUrl(blob);

  return { blob, dataUrl };
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
