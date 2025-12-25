import { StyleSheet } from '@react-pdf/renderer';
import { TemplateConfig } from '../config/schema';
import { fontFamilyMap, fontWeightMap } from '../fonts/register';

// Mapeos de escala
export const scaleMap: Record<'compact' | 'normal' | 'spacious', number> = {
  compact: 0.85,
  normal: 1,
  spacious: 1.15,
};

export const paddingMap: Record<'compact' | 'normal' | 'spacious', number> = {
  compact: 30,
  normal: 50,
  spacious: 70,
};

export const borderWidthMap: Record<'thin' | 'medium' | 'thick', number> = {
  thin: 1,
  medium: 2,
  thick: 4,
};

export const radiusMap: Record<'none' | 'small' | 'medium' | 'large', number> = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
};

export const logoSizeMap: Record<'small' | 'medium' | 'large', number> = {
  small: 60,
  medium: 90,
  large: 120,
};

export const qrSizeMap: Record<'small' | 'medium' | 'large', number> = {
  small: 50,
  medium: 70,
  large: 90,
};

// Dimensiones de papel en puntos (landscape)
export const paperDimensions: Record<'A4' | 'LETTER' | 'LEGAL', { width: number; height: number }> = {
  A4: { width: 841.89, height: 595.28 },
  LETTER: { width: 792, height: 612 },
  LEGAL: { width: 1008, height: 612 },
};

// Valores por defecto para evitar errores
const DEFAULT_SCALE: 'compact' | 'normal' | 'spacious' = 'normal';
const DEFAULT_PADDING: 'compact' | 'normal' | 'spacious' = 'normal';
const DEFAULT_BORDER_WIDTH: 'thin' | 'medium' | 'thick' = 'thin';
const DEFAULT_RADIUS: 'none' | 'small' | 'medium' | 'large' = 'none';
const DEFAULT_LOGO_SIZE: 'small' | 'medium' | 'large' = 'medium';
const DEFAULT_QR_SIZE: 'small' | 'medium' | 'large' = 'medium';
const DEFAULT_FONT: 'sans' | 'serif' | 'script' | 'slab' | 'display' = 'sans';
const DEFAULT_WEIGHT: 'normal' | 'medium' | 'bold' | 'black' = 'normal';
const DEFAULT_ALIGNMENT = 'center' as const;
const DEFAULT_TRANSFORM = 'none' as const;
const DEFAULT_LOGO_POSITION = 'center' as const;
const DEFAULT_SIGNATURE_POSITION = 'center' as const;
const DEFAULT_VERTICAL_BALANCE = 'centered' as const;

// Generador de estilos dinámicos
export const generateStyles = (config: TemplateConfig) => {
  // Aplicar valores por defecto para evitar undefined
  const scale = scaleMap[config.typography?.scale ?? DEFAULT_SCALE] ?? scaleMap[DEFAULT_SCALE];
  const padding = paddingMap[config.border?.padding ?? DEFAULT_PADDING] ?? paddingMap[DEFAULT_PADDING];
  const borderWidth = (config.border?.style ?? 'none') !== 'none'
    ? (borderWidthMap[config.border?.width ?? DEFAULT_BORDER_WIDTH] ?? borderWidthMap[DEFAULT_BORDER_WIDTH])
    : 0;
  const borderRadius = radiusMap[config.border?.radius ?? DEFAULT_RADIUS] ?? radiusMap[DEFAULT_RADIUS];

  // Valores de tipografía con defaults
  const bodyFont = fontFamilyMap[config.typography?.bodyFont ?? DEFAULT_FONT] ?? fontFamilyMap[DEFAULT_FONT];
  const titleFont = fontFamilyMap[config.typography?.titleFont ?? DEFAULT_FONT] ?? fontFamilyMap[DEFAULT_FONT];
  const accentFont = fontFamilyMap[config.typography?.accentFont ?? DEFAULT_FONT] ?? fontFamilyMap[DEFAULT_FONT];
  const alignment = config.typography?.alignment ?? DEFAULT_ALIGNMENT;
  const titleWeight = fontWeightMap[config.typography?.titleWeight ?? DEFAULT_WEIGHT] ?? fontWeightMap[DEFAULT_WEIGHT];
  const nameWeight = fontWeightMap[config.typography?.nameWeight ?? DEFAULT_WEIGHT] ?? fontWeightMap[DEFAULT_WEIGHT];
  const titleTransform = config.typography?.titleTransform ?? DEFAULT_TRANSFORM;

  // Valores de layout con defaults
  const logoSize = logoSizeMap[config.layout?.logoSize ?? DEFAULT_LOGO_SIZE] ?? logoSizeMap[DEFAULT_LOGO_SIZE];
  const qrSize = qrSizeMap[config.layout?.qrSize ?? DEFAULT_QR_SIZE] ?? qrSizeMap[DEFAULT_QR_SIZE];
  const logoPosition = config.layout?.logoPosition ?? DEFAULT_LOGO_POSITION;
  const signaturePosition = config.layout?.signaturePosition ?? DEFAULT_SIGNATURE_POSITION;
  const verticalBalance = config.layout?.verticalBalance ?? DEFAULT_VERTICAL_BALANCE;

  // Valores de colores con defaults
  const colors = {
    background: config.colors?.background ?? '#FFFFFF',
    text: config.colors?.text ?? '#1a1a2e',
    textMuted: config.colors?.textMuted ?? '#6b7280',
    primary: config.colors?.primary ?? '#1a365d',
    secondary: config.colors?.secondary ?? '#2d3748',
    accent: config.colors?.accent ?? '#c9a227',
    border: config.colors?.border ?? '#d4af37',
  };

  return StyleSheet.create({
    page: {
      backgroundColor: colors.background,
      padding: padding,
      fontFamily: bodyFont,
      position: 'relative',
    },

    container: {
      flex: 1,
      borderWidth: borderWidth,
      borderColor: colors.border,
      borderRadius: borderRadius,
      borderStyle: 'solid',
      padding: padding * 0.6,
      position: 'relative',
    },

    // Header
    header: {
      alignItems: 'center',
      marginBottom: 20 * scale,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: logoPosition.includes('left')
        ? 'flex-start'
        : logoPosition.includes('right')
          ? 'flex-end'
          : 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15 * scale,
    },

    logo: {
      width: logoSize,
      height: 'auto',
      maxHeight: logoSize * 0.8,
      objectFit: 'contain' as const,
    },

    organizationName: {
      fontFamily: bodyFont,
      fontSize: 14 * scale,
      fontWeight: fontWeightMap.medium,
      color: colors.text,
      textAlign: alignment,
      marginTop: 8,
    },

    organizationSubtitle: {
      fontFamily: bodyFont,
      fontSize: 11 * scale,
      color: colors.textMuted,
      textAlign: alignment,
      marginTop: 2,
    },

    // Contenido principal
    mainContent: {
      flex: 1,
      justifyContent: verticalBalance === 'top-heavy'
        ? 'flex-start'
        : verticalBalance === 'bottom-heavy'
          ? 'flex-end'
          : 'center',
      alignItems: 'center',
    },

    title: {
      fontFamily: titleFont,
      fontSize: 32 * scale,
      fontWeight: titleWeight,
      color: colors.primary,
      textAlign: alignment,
      textTransform: titleTransform,
      letterSpacing: titleTransform === 'uppercase' ? 3 : 0,
      marginBottom: 10 * scale,
    },

    subtitle: {
      fontFamily: bodyFont,
      fontSize: 14 * scale,
      color: colors.textMuted,
      textAlign: alignment,
      marginBottom: 20 * scale,
    },

    studentName: {
      fontFamily: accentFont,
      fontSize: 38 * scale,
      fontWeight: nameWeight,
      color: colors.text,
      textAlign: alignment,
      marginBottom: 15 * scale,
    },

    courseName: {
      fontFamily: bodyFont,
      fontSize: 18 * scale,
      fontWeight: fontWeightMap.medium,
      color: colors.secondary,
      textAlign: alignment,
      marginBottom: 25 * scale,
      maxWidth: '80%',
    },

    // Detalles
    details: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 40,
      marginTop: 15 * scale,
      marginBottom: 20 * scale,
    },

    detailItem: {
      alignItems: 'center',
    },

    detailLabel: {
      fontFamily: bodyFont,
      fontSize: 9 * scale,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },

    detailValue: {
      fontFamily: bodyFont,
      fontSize: 12 * scale,
      fontWeight: fontWeightMap.medium,
      color: colors.text,
    },

    // Divisor
    divider: {
      width: 120,
      height: 1,
      backgroundColor: colors.accent,
      marginVertical: 15 * scale,
    },

    // Firma
    signatureSection: {
      flexDirection: signaturePosition === 'dual' ? 'row' : 'column',
      justifyContent: signaturePosition === 'dual'
        ? 'space-around'
        : signaturePosition === 'center'
          ? 'center'
          : signaturePosition === 'left'
            ? 'flex-start'
            : 'flex-end',
      alignItems: 'center',
      marginTop: 30 * scale,
      width: '100%',
    },

    signature: {
      alignItems: 'center',
      minWidth: 150,
    },

    signatureImage: {
      width: 120,
      height: 50,
      objectFit: 'contain' as const,
      marginBottom: 5,
    },

    signatureLine: {
      width: 150,
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 8,
    },

    signatureLabel: {
      fontFamily: bodyFont,
      fontSize: 10 * scale,
      color: colors.textMuted,
    },

    signatureName: {
      fontFamily: bodyFont,
      fontSize: 11 * scale,
      fontWeight: fontWeightMap.medium,
      color: colors.text,
      marginBottom: 2,
    },

    // Footer
    footer: {
      position: 'absolute',
      bottom: padding * 0.3,
      left: padding * 0.3,
      right: padding * 0.3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },

    footerLeft: {
      alignItems: 'flex-start',
    },

    footerCenter: {
      alignItems: 'center',
      flex: 1,
    },

    footerRight: {
      alignItems: 'flex-end',
    },

    certificateNumber: {
      fontFamily: bodyFont,
      fontSize: 8 * scale,
      color: colors.textMuted,
    },

    qrCode: {
      width: qrSize,
      height: qrSize,
    },

    qrLabel: {
      fontFamily: bodyFont,
      fontSize: 7 * scale,
      color: colors.textMuted,
      marginTop: 4,
      textAlign: 'center',
    },
  });
};
