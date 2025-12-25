import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Circle,
} from '@react-pdf/renderer';
import { CertificateTemplateProps, formatDate, getPageDimensions } from './base';
import { generateStyles, paddingMap } from '../utils/styles';
import { registerFonts } from '../fonts/register';
import { FlourishCorner } from '../primitives/ornaments';
import { Divider } from '../primitives/dividers';
import { Seal } from '../primitives/seals';

// Registrar fuentes
registerFonts();

// Patrón de fondo decorativo
interface DecorativeBackgroundProps {
  color: string;
  opacity: number;
  width: number;
  height: number;
}

const DecorativeBackground: React.FC<DecorativeBackgroundProps> = ({
  color,
  opacity,
  width,
  height,
}) => {
  const circles: React.ReactNode[] = [];
  const spacing = 60;

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      circles.push(
        <Circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={2}
          fill={color}
          opacity={opacity}
        />
      );
    }
  }

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      {circles}
    </Svg>
  );
};

export const CreativeTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  config,
  qrCodeDataUrl,
}) => {
  const styles = generateStyles(config);
  const paperSize = config.layout?.paperSize ?? 'A4';
  const orientation = config.layout?.orientation ?? 'landscape';
  const { width, height } = getPageDimensions(paperSize, orientation);
  const padding = paddingMap[config.border?.padding ?? 'normal'] ?? paddingMap.normal;

  // Defaults para evitar undefined
  const colors = {
    primary: config.colors?.primary ?? '#1a365d',
    secondary: config.colors?.secondary ?? '#2d3748',
    accent: config.colors?.accent ?? '#c9a227',
  };

  const border = {
    cornerStyle: config.border?.cornerStyle ?? 'none',
  };

  const ornaments = {
    backgroundPattern: config.ornaments?.backgroundPattern ?? 'none',
    backgroundOpacity: config.ornaments?.backgroundOpacity ?? 0.1,
    dividerStyle: config.ornaments?.dividerStyle ?? 'ornate',
    showSeal: config.ornaments?.showSeal ?? false,
    sealStyle: config.ornaments?.sealStyle ?? 'ribbon',
  };

  const content = {
    showOrganizationName: config.content?.showOrganizationName ?? true,
    showSubtitle: config.content?.showSubtitle ?? true,
    showDate: config.content?.showDate ?? true,
    showHours: config.content?.showHours ?? true,
    showGrade: config.content?.showGrade ?? false,
    showInstructor: config.content?.showInstructor ?? true,
    showCertificateNumber: config.content?.showCertificateNumber ?? true,
    showQR: config.content?.showQR ?? true,
    headerText: config.content?.headerText ?? 'Certificado de Excelencia',
    subtitleTemplate: config.content?.subtitleTemplate ?? '',
  };

  const layout = {
    showSignatureLine: config.layout?.showSignatureLine ?? true,
    signaturePosition: config.layout?.signaturePosition ?? 'center',
  };

  const branding = {
    logoUrl: config.branding?.logoUrl ?? '',
    organizationName: config.branding?.organizationName ?? '',
    signatureImage: config.branding?.signatureImage ?? '',
    signatureLabel: config.branding?.signatureLabel ?? '',
  };

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        {/* Fondo decorativo */}
        {ornaments.backgroundPattern === 'watermark' && (
          <DecorativeBackground
            color={colors.accent}
            opacity={ornaments.backgroundOpacity}
            width={width}
            height={height}
          />
        )}

        <View style={styles.container}>
          {/* Flourishes en las esquinas */}
          {(border.cornerStyle === 'flourish' || border.cornerStyle === 'ornate' || border.cornerStyle === 'simple') && (
            <>
              <View style={{ position: 'absolute', top: 5, left: 5 }}>
                <FlourishCorner color={colors.primary} position="top-left" size={border.cornerStyle === 'simple' ? 35 : 60} />
              </View>
              <View style={{ position: 'absolute', top: 5, right: 5 }}>
                <FlourishCorner color={colors.primary} position="top-right" size={border.cornerStyle === 'simple' ? 35 : 60} />
              </View>
              <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                <FlourishCorner color={colors.primary} position="bottom-right" size={border.cornerStyle === 'simple' ? 35 : 60} />
              </View>
              <View style={{ position: 'absolute', bottom: 5, left: 5 }}>
                <FlourishCorner color={colors.primary} position="bottom-left" size={border.cornerStyle === 'simple' ? 35 : 60} />
              </View>
            </>
          )}

          {/* Header */}
          <View style={styles.header}>
            {branding.logoUrl && (
              <View style={styles.headerRow}>
                <Image src={branding.logoUrl} style={styles.logo} />
              </View>
            )}
            {content.showOrganizationName && branding.organizationName && (
              <Text style={styles.organizationName}>
                {branding.organizationName}
              </Text>
            )}
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {/* Título decorativo */}
            <Text style={styles.title}>
              {content.headerText}
            </Text>

            {/* Subtítulo */}
            {content.showSubtitle && content.subtitleTemplate && (
              <Text style={styles.subtitle}>
                {content.subtitleTemplate}
              </Text>
            )}

            {/* Nombre del estudiante con estilo script */}
            <Text style={styles.studentName}>
              {data.student_name}
            </Text>

            {/* Divisor ornamentado */}
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
              <Divider
                style={ornaments.dividerStyle}
                color={colors.accent}
                secondaryColor={colors.secondary}
                width={250}
              />
            </View>

            {/* Curso */}
            <Text style={styles.courseName}>
              {data.course_name}
            </Text>

            {/* Detalles con estilo creativo */}
            <View style={styles.details}>
              {content.showDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Fecha ✦</Text>
                  <Text style={styles.detailValue}>{formatDate(data.issue_date)}</Text>
                </View>
              )}
              {content.showHours && data.hours && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Horas ✦</Text>
                  <Text style={styles.detailValue}>{data.hours}</Text>
                </View>
              )}
              {content.showGrade && data.grade && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Calificación ✦</Text>
                  <Text style={styles.detailValue}>{data.grade}%</Text>
                </View>
              )}
            </View>

            {/* Sello ribbon */}
            {ornaments.showSeal && (
              <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center' }}>
                <Seal
                  style={ornaments.sealStyle}
                  primaryColor={colors.primary}
                  accentColor={colors.accent}
                  size={100}
                />
              </View>
            )}

            {/* Firma */}
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                {branding.signatureImage && (
                  <Image src={branding.signatureImage} style={styles.signatureImage} />
                )}
                {layout.showSignatureLine && (
                  <View style={[styles.signatureLine, { borderStyle: 'dashed' }]} />
                )}
                {content.showInstructor && data.instructor_name && (
                  <Text style={styles.signatureName}>{data.instructor_name}</Text>
                )}
                {branding.signatureLabel && (
                  <Text style={styles.signatureLabel}>
                    {branding.signatureLabel}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {content.showQR && qrCodeDataUrl && (
                <View style={{ alignItems: 'flex-start' }}>
                  <Image src={qrCodeDataUrl} style={styles.qrCode} />
                </View>
              )}
            </View>

            <View style={styles.footerRight}>
              {content.showCertificateNumber && (
                <Text style={styles.certificateNumber}>
                  {data.certificate_number}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
