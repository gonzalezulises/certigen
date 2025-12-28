import { z } from 'zod';

// Certificate Types
export type CertificateType = 'participation' | 'completion';

export interface Certificate {
  id: string;
  certificate_number: string;
  user_id: string | null;
  course_id: string | null;
  course_name: string;
  student_name: string;
  student_email: string;
  certificate_type: CertificateType;
  issue_date: string;
  expiry_date: string | null;
  instructor_name: string | null;
  hours: number | null;
  grade: number | null;
  metadata: Record<string, unknown>;
  qr_code_url: string | null;
  pdf_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  html_template: string;
  css_styles: string | null;
  background_image_url: string | null;
  placeholders: Record<string, string>;
  is_default: boolean;
  created_at: string;
}

export interface CertificateValidation {
  id: string;
  certificate_id: string;
  validated_at: string;
  validated_by_ip: string | null;
  is_valid: boolean;
  validation_method: 'qr' | 'number' | 'email';
}

export interface EduPlatformIntegration {
  id: string;
  course_id: string | null;
  certificate_template_id: string | null;
  auto_generate: boolean;
  integration_key: string;
  created_at: string;
}

// Zod Schemas for Validation
// Schema for anonymous users (email optional - only required for email delivery)
export const certificateFormSchema = z.object({
  student_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  student_email: z.string().email('Email inválido').optional().or(z.literal('')),
  course_name: z.string().min(2, 'El nombre del curso debe tener al menos 2 caracteres'),
  certificate_type: z.enum(['participation', 'completion']),
  instructor_name: z.string().optional(),
  hours: z.number().min(1).optional(),
  grade: z.number().min(0).max(100).optional(),
  issue_date: z.string(),
  template_id: z.string().optional(),
  logo_url: z.string().optional(),
  organization_name: z.string().optional(),
});

// Schema for authenticated users (email optional, certificates are saved)
export const authenticatedCertificateFormSchema = z.object({
  student_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  student_email: z.string().email('Email inválido').optional().or(z.literal('')),
  course_name: z.string().min(2, 'El nombre del curso debe tener al menos 2 caracteres'),
  certificate_type: z.enum(['participation', 'completion']),
  instructor_name: z.string().optional(),
  hours: z.number().min(1).optional(),
  grade: z.number().min(0).max(100).optional(),
  issue_date: z.string(),
  template_id: z.string().optional(),
  logo_url: z.string().optional(),
  organization_name: z.string().optional(),
});

export type CertificateFormData = z.infer<typeof certificateFormSchema>;

// CSV Batch Upload Types
export interface CSVRow {
  student_name: string;
  student_email: string;
  course_name?: string;
  certificate_type?: 'participation' | 'completion';
  instructor_name?: string;
  hours?: number;
  grade?: number;
  issue_date?: string;
}

export interface BatchGenerateResult {
  success: boolean;
  total: number;
  generated: number;
  failed: number;
  certificates: Certificate[];
  errors: { row: number; error: string }[];
}

// Regex for certificate number validation (supports legacy and new format)
const certificateNumberRegex = /^CER-\d{8}-(\d{6}|[A-Z0-9_-]{10})$/;

export const validateCertificateSchema = z.object({
  certificate_number: z
    .string()
    .min(1, 'El número de certificado es requerido')
    .regex(certificateNumberRegex, 'Formato de certificado inválido'),
});

export type ValidateCertificateData = z.infer<typeof validateCertificateSchema>;

// API Response Types
export interface GenerateCertificateResponse {
  success: boolean;
  certificate?: Certificate;
  pdf_url?: string;
  error?: string;
}

export interface ValidateCertificateResponse {
  success: boolean;
  is_valid: boolean;
  certificate?: Certificate;
  validation_count?: number;
  error?: string;
}

// Template Types
export type TemplateStyle = 'elegant' | 'minimal' | 'corporate';
export type PaperSize = 'a4' | 'legal';

export interface PaperSizeConfig {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  cssAspect: string;
}

export const PAPER_SIZES: Record<PaperSize, PaperSizeConfig> = {
  a4: {
    name: 'A4 Horizontal',
    width: 297,
    height: 210,
    aspectRatio: 297 / 210,
    cssAspect: '297/210',
  },
  legal: {
    name: 'Legal Horizontal',
    width: 355.6,
    height: 215.9,
    aspectRatio: 355.6 / 215.9,
    cssAspect: '1647/1000',
  },
};

export interface TemplateConfig {
  id: TemplateStyle;
  name: string;
  description: string;
  preview_image: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Diseño profesional con degradado azul y bordes dorados',
    preview_image: '/templates/elegant-preview.png',
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Diseño limpio y moderno con líneas simples',
    preview_image: '/templates/minimal-preview.png',
  },
  {
    id: 'corporate',
    name: 'Corporativo',
    description: 'Diseño formal con espacio para logo institucional',
    preview_image: '/templates/corporate-preview.png',
  },
];
