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
export const certificateFormSchema = z.object({
  student_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  student_email: z.string().email('Email inválido'),
  course_name: z.string().min(2, 'El nombre del curso debe tener al menos 2 caracteres'),
  certificate_type: z.enum(['participation', 'completion']),
  instructor_name: z.string().optional(),
  hours: z.number().min(1).optional(),
  grade: z.number().min(0).max(100).optional(),
  issue_date: z.string(),
  template_id: z.string().optional(),
});

export type CertificateFormData = z.infer<typeof certificateFormSchema>;

export const validateCertificateSchema = z.object({
  certificate_number: z.string().min(1, 'El número de certificado es requerido'),
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
