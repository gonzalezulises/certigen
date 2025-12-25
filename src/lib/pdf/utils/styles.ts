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

// Generador de estilos dinámicos
export const generateStyles = (config: TemplateConfig) => {
  const scale = scaleMap[config.typography.scale];
  const padding = paddingMap[config.border.padding];
  const borderWidth = config.border.style !== 'none' ? borderWidthMap[config.border.width] : 0;
  const borderRadius = radiusMap[config.border.radius];

  return StyleSheet.create({
    page: {
      backgroundColor: config.colors.background,
      padding: padding,
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      position: 'relative',
    },

    container: {
      flex: 1,
      borderWidth: borderWidth,
      borderColor: config.colors.border,
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
      justifyContent: config.layout.logoPosition.includes('left')
        ? 'flex-start'
        : config.layout.logoPosition.includes('right')
          ? 'flex-end'
          : 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15 * scale,
    },

    logo: {
      width: logoSizeMap[config.layout.logoSize],
      height: 'auto',
      maxHeight: logoSizeMap[config.layout.logoSize] * 0.8,
      objectFit: 'contain' as const,
    },

    organizationName: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 14 * scale,
      fontWeight: fontWeightMap.medium,
      color: config.colors.text,
      textAlign: config.typography.alignment,
      marginTop: 8,
    },

    organizationSubtitle: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 11 * scale,
      color: config.colors.textMuted,
      textAlign: config.typography.alignment,
      marginTop: 2,
    },

    // Contenido principal
    mainContent: {
      flex: 1,
      justifyContent: config.layout.verticalBalance === 'top-heavy'
        ? 'flex-start'
        : config.layout.verticalBalance === 'bottom-heavy'
          ? 'flex-end'
          : 'center',
      alignItems: 'center',
    },

    title: {
      fontFamily: fontFamilyMap[config.typography.titleFont],
      fontSize: 32 * scale,
      fontWeight: fontWeightMap[config.typography.titleWeight],
      color: config.colors.primary,
      textAlign: config.typography.alignment,
      textTransform: config.typography.titleTransform,
      letterSpacing: config.typography.titleTransform === 'uppercase' ? 3 : 0,
      marginBottom: 10 * scale,
    },

    subtitle: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 14 * scale,
      color: config.colors.textMuted,
      textAlign: config.typography.alignment,
      marginBottom: 20 * scale,
    },

    studentName: {
      fontFamily: fontFamilyMap[config.typography.accentFont],
      fontSize: 38 * scale,
      fontWeight: fontWeightMap[config.typography.nameWeight],
      color: config.colors.text,
      textAlign: config.typography.alignment,
      marginBottom: 15 * scale,
    },

    courseName: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 18 * scale,
      fontWeight: fontWeightMap.medium,
      color: config.colors.secondary,
      textAlign: config.typography.alignment,
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
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 9 * scale,
      color: config.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },

    detailValue: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 12 * scale,
      fontWeight: fontWeightMap.medium,
      color: config.colors.text,
    },

    // Divisor
    divider: {
      width: 120,
      height: 1,
      backgroundColor: config.colors.accent,
      marginVertical: 15 * scale,
    },

    // Firma
    signatureSection: {
      flexDirection: config.layout.signaturePosition === 'dual' ? 'row' : 'column',
      justifyContent: config.layout.signaturePosition === 'dual'
        ? 'space-around'
        : config.layout.signaturePosition === 'center'
          ? 'center'
          : config.layout.signaturePosition === 'left'
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
      backgroundColor: config.colors.border,
      marginBottom: 8,
    },

    signatureLabel: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 10 * scale,
      color: config.colors.textMuted,
    },

    signatureName: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 11 * scale,
      fontWeight: fontWeightMap.medium,
      color: config.colors.text,
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
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 8 * scale,
      color: config.colors.textMuted,
    },

    qrCode: {
      width: qrSizeMap[config.layout.qrSize],
      height: qrSizeMap[config.layout.qrSize],
    },

    qrLabel: {
      fontFamily: fontFamilyMap[config.typography.bodyFont],
      fontSize: 7 * scale,
      color: config.colors.textMuted,
      marginTop: 4,
      textAlign: 'center',
    },
  });
};
