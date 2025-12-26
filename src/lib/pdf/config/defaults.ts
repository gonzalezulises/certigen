import { TemplateConfig, TemplateDefinition, TemplateId } from './schema';

// ============================================
// PLANTILLA 1: CLÁSICA ACADÉMICA
// ============================================
export const classicDefaults: TemplateConfig = {
  colors: {
    primary: '#1a365d',
    secondary: '#2c5282',
    accent: '#c9a227',
    background: '#ffffff',
    text: '#1a202c',
    textMuted: '#4a5568',
    border: '#1a365d',
  },
  typography: {
    titleFont: 'serif',
    bodyFont: 'serif',
    accentFont: 'script',
    scale: 'normal',
    titleWeight: 'bold',
    nameWeight: 'bold',
    titleTransform: 'uppercase',
    alignment: 'center',
  },
  border: {
    style: 'certificate',
    width: 'medium',
    radius: 'none',
    padding: 'spacious',
    cornerStyle: 'ornate',
  },
  ornaments: {
    dividerStyle: 'ornate',
    showSeal: false,
    sealStyle: 'classic',
    sealPosition: 'bottom-center',
    backgroundPattern: 'none',
    backgroundOpacity: 0.05,
    watermarkOpacity: 0.03,
  },
  layout: {
    orientation: 'landscape',
    paperSize: 'A4',
    logoPosition: 'top-center',
    logoSize: 'medium',
    qrPosition: 'bottom-right',
    qrSize: 'small',
    signaturePosition: 'center',
    showSignatureLine: true,
    verticalBalance: 'centered',
  },
  content: {
    showSubtitle: true,
    showHours: true,
    showGrade: true,
    showDate: true,
    showInstructor: true,
    showCertificateNumber: true,
    showQR: true,
    headerText: 'Certificado de Completación',
    subtitleTemplate: 'Se certifica que',
    showOrganizationName: true,
  },
  branding: {
    organizationName: '',
    signatureLabel: 'Director',
  },
};

// ============================================
// PLANTILLA 2: MINIMALISTA
// ============================================
export const minimalDefaults: TemplateConfig = {
  colors: {
    primary: '#18181b',
    secondary: '#3f3f46',
    accent: '#18181b',
    background: '#fafafa',
    text: '#18181b',
    textMuted: '#71717a',
    border: '#e4e4e7',
  },
  typography: {
    titleFont: 'sans',
    bodyFont: 'sans',
    accentFont: 'serif',
    scale: 'spacious',
    titleWeight: 'normal',
    nameWeight: 'medium',
    titleTransform: 'none',
    alignment: 'center',
  },
  border: {
    style: 'none',
    width: 'thin',
    radius: 'none',
    padding: 'spacious',
    cornerStyle: 'none',
  },
  ornaments: {
    dividerStyle: 'simple',
    showSeal: false,
    sealStyle: 'modern',
    sealPosition: 'bottom-center',
    backgroundPattern: 'none',
    backgroundOpacity: 0,
    watermarkOpacity: 0,
  },
  layout: {
    orientation: 'landscape',
    paperSize: 'A4',
    logoPosition: 'top-center',
    logoSize: 'small',
    qrPosition: 'bottom-center',
    qrSize: 'small',
    signaturePosition: 'center',
    showSignatureLine: false,
    verticalBalance: 'centered',
  },
  content: {
    showSubtitle: false,
    showHours: false,
    showGrade: false,
    showDate: true,
    showInstructor: true,
    showCertificateNumber: false,
    showQR: true,
    headerText: 'Certificado',
    subtitleTemplate: '',
    showOrganizationName: true,
  },
  branding: {
    organizationName: '',
    signatureLabel: '',
  },
};

// ============================================
// PLANTILLA 3: CREATIVA
// ============================================
export const creativeDefaults: TemplateConfig = {
  colors: {
    primary: '#be185d',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#fffbeb',
    text: '#1c1917',
    textMuted: '#57534e',
    border: '#be185d',
  },
  typography: {
    titleFont: 'display',
    bodyFont: 'serif',
    accentFont: 'script',
    scale: 'spacious',
    titleWeight: 'bold',
    nameWeight: 'bold',
    titleTransform: 'capitalize',
    alignment: 'center',
  },
  border: {
    style: 'ornate',
    width: 'thick',
    radius: 'large',
    padding: 'spacious',
    cornerStyle: 'flourish',
  },
  ornaments: {
    dividerStyle: 'ornate',
    showSeal: false,
    sealStyle: 'ribbon',
    sealPosition: 'bottom-center',
    backgroundPattern: 'watermark',
    backgroundOpacity: 0.08,
    watermarkText: '✦',
    watermarkOpacity: 0.05,
  },
  layout: {
    orientation: 'landscape',
    paperSize: 'A4',
    logoPosition: 'top-center',
    logoSize: 'medium',
    qrPosition: 'bottom-left',
    qrSize: 'small',
    signaturePosition: 'center',
    showSignatureLine: true,
    verticalBalance: 'centered',
  },
  content: {
    showSubtitle: true,
    showHours: true,
    showGrade: true,
    showDate: true,
    showInstructor: true,
    showCertificateNumber: true,
    showQR: true,
    headerText: 'Certificado de Excelencia',
    subtitleTemplate: 'Con orgullo reconocemos a',
    showOrganizationName: true,
  },
  branding: {
    organizationName: '',
    signatureLabel: 'Director',
  },
};

// ============================================
// REGISTRY DE PLANTILLAS
// ============================================
export const templateDefinitions: Record<TemplateId, TemplateDefinition> = {
  classic: {
    id: 'classic',
    name: 'Clásica Académica',
    description: 'Diseño formal con bordes ornamentados, ideal para instituciones educativas y certificaciones profesionales',
    preview: '/templates/classic-preview.png',
    defaultConfig: classicDefaults,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Espaciado amplio y tipografía como protagonista, elegancia en la simplicidad',
    preview: '/templates/minimal-preview.png',
    defaultConfig: minimalDefaults,
  },
  creative: {
    id: 'creative',
    name: 'Creativa',
    description: 'Diseño expresivo con elementos decorativos atrevidos, para reconocimientos especiales',
    preview: '/templates/creative-preview.png',
    defaultConfig: creativeDefaults,
  },
};

// ============================================
// HELPER: OBTENER CONFIG POR DEFECTO
// ============================================
export const getDefaultConfig = (templateId: TemplateId): TemplateConfig => {
  return JSON.parse(JSON.stringify(templateDefinitions[templateId].defaultConfig));
};
