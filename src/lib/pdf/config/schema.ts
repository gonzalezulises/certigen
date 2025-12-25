// ============================================
// COLORES
// ============================================
export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
}

// ============================================
// TIPOGRAFÍA
// ============================================
export type FontFamily = 'serif' | 'sans' | 'script' | 'slab' | 'display';

export interface TypographyConfig {
  titleFont: FontFamily;
  bodyFont: FontFamily;
  accentFont: FontFamily;
  scale: 'compact' | 'normal' | 'spacious';
  titleWeight: 'normal' | 'medium' | 'bold';
  nameWeight: 'normal' | 'medium' | 'bold' | 'black';
  titleTransform: 'none' | 'uppercase' | 'capitalize';
  alignment: 'left' | 'center' | 'right';
}

// ============================================
// BORDES Y MARCOS
// ============================================
export type BorderStyle =
  | 'none'
  | 'simple'
  | 'double'
  | 'ornate'
  | 'certificate'
  | 'geometric'
  | 'gradient';

export interface BorderConfig {
  style: BorderStyle;
  width: 'thin' | 'medium' | 'thick';
  radius: 'none' | 'small' | 'medium' | 'large';
  padding: 'compact' | 'normal' | 'spacious';
  cornerStyle: 'none' | 'simple' | 'ornate' | 'flourish';
}

// ============================================
// ELEMENTOS DECORATIVOS
// ============================================
export interface OrnamentConfig {
  dividerStyle: 'none' | 'simple' | 'ornate' | 'dots' | 'gradient';
  showSeal: boolean;
  sealStyle: 'classic' | 'modern' | 'ribbon' | 'badge';
  sealPosition: 'bottom-center' | 'bottom-right' | 'top-right';
  backgroundPattern: 'none' | 'subtle-grid' | 'diagonal-lines' | 'watermark' | 'gradient';
  backgroundOpacity: number;
  watermarkText?: string;
  watermarkOpacity: number;
}

// ============================================
// LAYOUT
// ============================================
export interface LayoutConfig {
  orientation: 'landscape' | 'portrait';
  paperSize: 'A4' | 'LETTER' | 'LEGAL';
  logoPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoSize: 'small' | 'medium' | 'large';
  qrPosition: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'integrated';
  qrSize: 'small' | 'medium' | 'large';
  signaturePosition: 'left' | 'center' | 'right' | 'dual';
  showSignatureLine: boolean;
  verticalBalance: 'top-heavy' | 'centered' | 'bottom-heavy';
}

// ============================================
// CONTENIDO VISIBLE
// ============================================
export interface ContentConfig {
  showSubtitle: boolean;
  showHours: boolean;
  showGrade: boolean;
  showDate: boolean;
  showInstructor: boolean;
  showCertificateNumber: boolean;
  showQR: boolean;
  headerText: string;
  subtitleTemplate: string;
  footerText?: string;
  showOrganizationName: boolean;
  organizationSubtitle?: string;
}

// ============================================
// BRANDING
// ============================================
export interface BrandingConfig {
  logoUrl?: string;
  logoBackgroundColor?: string;
  signatureImage?: string;
  signatureLabel: string;
  secondSignatureImage?: string;
  secondSignatureLabel?: string;
  organizationName: string;
  organizationSubtitle?: string;
}

// ============================================
// CONFIGURACIÓN COMPLETA
// ============================================
export interface TemplateConfig {
  colors: ColorConfig;
  typography: TypographyConfig;
  border: BorderConfig;
  ornaments: OrnamentConfig;
  layout: LayoutConfig;
  content: ContentConfig;
  branding: BrandingConfig;
}

// ============================================
// PLANTILLA BASE
// ============================================
export type TemplateId = 'classic' | 'minimal' | 'creative';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  defaultConfig: TemplateConfig;
  constraints?: {
    disabledOptions?: Partial<Record<string, boolean>>;
    requiredOptions?: Partial<Record<string, boolean>>;
  };
}

// ============================================
// DATOS DEL CERTIFICADO
// ============================================
export interface CertificateData {
  id?: string;
  certificate_number: string;
  student_name: string;
  student_email?: string;
  course_name: string;
  certificate_type: 'completion' | 'achievement' | 'participation' | 'excellence';
  issue_date: string;
  instructor_name?: string;
  hours?: number;
  grade?: number;
  qr_code_url?: string;
  organization_name?: string;
}

// ============================================
// PALETAS DE COLORES PREDEFINIDAS
// ============================================
export interface ColorPalette {
  name: string;
  colors: ColorConfig;
}

export const colorPalettes: ColorPalette[] = [
  {
    name: 'Azul Ejecutivo',
    colors: {
      primary: '#1a365d',
      secondary: '#2c5282',
      accent: '#c9a227',
      background: '#ffffff',
      text: '#1a202c',
      textMuted: '#4a5568',
      border: '#1a365d',
    },
  },
  {
    name: 'Verde Institucional',
    colors: {
      primary: '#14532d',
      secondary: '#166534',
      accent: '#ca8a04',
      background: '#f0fdf4',
      text: '#14532d',
      textMuted: '#4d7c0f',
      border: '#14532d',
    },
  },
  {
    name: 'Rojo Corporativo',
    colors: {
      primary: '#7f1d1d',
      secondary: '#991b1b',
      accent: '#b45309',
      background: '#ffffff',
      text: '#1c1917',
      textMuted: '#44403c',
      border: '#7f1d1d',
    },
  },
  {
    name: 'Monocromático',
    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      accent: '#52525b',
      background: '#fafafa',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
    },
  },
  {
    name: 'Púrpura Premium',
    colors: {
      primary: '#581c87',
      secondary: '#7e22ce',
      accent: '#d97706',
      background: '#faf5ff',
      text: '#1e1b4b',
      textMuted: '#6b7280',
      border: '#581c87',
    },
  },
  {
    name: 'Oceánico',
    colors: {
      primary: '#0c4a6e',
      secondary: '#0369a1',
      accent: '#0d9488',
      background: '#f0f9ff',
      text: '#0c4a6e',
      textMuted: '#64748b',
      border: '#0c4a6e',
    },
  },
];
