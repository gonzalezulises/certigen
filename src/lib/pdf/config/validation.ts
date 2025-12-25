import { z } from 'zod';
import { TemplateConfig, TemplateId } from './schema';

export const colorConfigSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  border: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const typographyConfigSchema = z.object({
  titleFont: z.enum(['serif', 'sans', 'script', 'slab', 'display']),
  bodyFont: z.enum(['serif', 'sans', 'script', 'slab', 'display']),
  accentFont: z.enum(['serif', 'sans', 'script', 'slab', 'display']),
  scale: z.enum(['compact', 'normal', 'spacious']),
  titleWeight: z.enum(['normal', 'medium', 'bold']),
  nameWeight: z.enum(['normal', 'medium', 'bold', 'black']),
  titleTransform: z.enum(['none', 'uppercase', 'capitalize']),
  alignment: z.enum(['left', 'center', 'right']),
});

export const borderConfigSchema = z.object({
  style: z.enum(['none', 'simple', 'double', 'ornate', 'certificate', 'geometric', 'gradient']),
  width: z.enum(['thin', 'medium', 'thick']),
  radius: z.enum(['none', 'small', 'medium', 'large']),
  padding: z.enum(['compact', 'normal', 'spacious']),
  cornerStyle: z.enum(['none', 'simple', 'ornate', 'flourish']),
});

export const ornamentConfigSchema = z.object({
  dividerStyle: z.enum(['none', 'simple', 'ornate', 'dots', 'gradient']),
  showSeal: z.boolean(),
  sealStyle: z.enum(['classic', 'modern', 'ribbon', 'badge']),
  sealPosition: z.enum(['bottom-center', 'bottom-right', 'top-right']),
  backgroundPattern: z.enum(['none', 'subtle-grid', 'diagonal-lines', 'watermark', 'gradient']),
  backgroundOpacity: z.number().min(0).max(1),
  watermarkText: z.string().optional(),
  watermarkOpacity: z.number().min(0).max(1),
});

export const layoutConfigSchema = z.object({
  orientation: z.enum(['landscape', 'portrait']),
  paperSize: z.enum(['A4', 'LETTER', 'LEGAL']),
  logoPosition: z.enum(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-right']),
  logoSize: z.enum(['small', 'medium', 'large']),
  qrPosition: z.enum(['bottom-left', 'bottom-right', 'bottom-center', 'integrated']),
  qrSize: z.enum(['small', 'medium', 'large']),
  signaturePosition: z.enum(['left', 'center', 'right', 'dual']),
  showSignatureLine: z.boolean(),
  verticalBalance: z.enum(['top-heavy', 'centered', 'bottom-heavy']),
});

export const contentConfigSchema = z.object({
  showSubtitle: z.boolean(),
  showHours: z.boolean(),
  showGrade: z.boolean(),
  showDate: z.boolean(),
  showInstructor: z.boolean(),
  showCertificateNumber: z.boolean(),
  showQR: z.boolean(),
  headerText: z.string().min(1).max(100),
  subtitleTemplate: z.string().max(200),
  footerText: z.string().max(200).optional(),
  showOrganizationName: z.boolean(),
  organizationSubtitle: z.string().max(100).optional(),
});

export const brandingConfigSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal('')),
  logoBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  signatureImage: z.string().url().optional().or(z.literal('')),
  signatureLabel: z.string().max(50),
  secondSignatureImage: z.string().url().optional().or(z.literal('')),
  secondSignatureLabel: z.string().max(50).optional(),
  organizationName: z.string().max(100),
  organizationSubtitle: z.string().max(100).optional(),
});

export const templateConfigSchema = z.object({
  colors: colorConfigSchema,
  typography: typographyConfigSchema,
  border: borderConfigSchema,
  ornaments: ornamentConfigSchema,
  layout: layoutConfigSchema,
  content: contentConfigSchema,
  branding: brandingConfigSchema,
});

export const validateTemplateConfig = (config: unknown): TemplateConfig => {
  return templateConfigSchema.parse(config);
};

export const isValidTemplateId = (id: string): id is TemplateId => {
  return ['classic', 'minimal', 'creative'].includes(id);
};
