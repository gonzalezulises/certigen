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
  const { width, height } = getPageDimensions(config.layout.paperSize, config.layout.orientation);
  const padding = paddingMap[config.border.padding];

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        {/* Fondo decorativo */}
        {config.ornaments.backgroundPattern === 'watermark' && (
          <DecorativeBackground
            color={config.colors.accent}
            opacity={config.ornaments.backgroundOpacity}
            width={width}
            height={height}
          />
        )}

        <View style={styles.container}>
          {/* Flourishes en las esquinas */}
          {config.border.cornerStyle === 'flourish' && (
            <>
              <View style={{ position: 'absolute', top: 5, left: 5 }}>
                <FlourishCorner color={config.colors.primary} position="top-left" size={60} />
              </View>
              <View style={{ position: 'absolute', top: 5, right: 5 }}>
                <FlourishCorner color={config.colors.primary} position="top-right" size={60} />
              </View>
              <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                <FlourishCorner color={config.colors.primary} position="bottom-right" size={60} />
              </View>
              <View style={{ position: 'absolute', bottom: 5, left: 5 }}>
                <FlourishCorner color={config.colors.primary} position="bottom-left" size={60} />
              </View>
            </>
          )}

          {/* Header */}
          <View style={styles.header}>
            {config.branding.logoUrl && (
              <View style={styles.headerRow}>
                <Image src={config.branding.logoUrl} style={styles.logo} />
              </View>
            )}
            {config.content.showOrganizationName && config.branding.organizationName && (
              <Text style={styles.organizationName}>
                {config.branding.organizationName}
              </Text>
            )}
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {/* Título decorativo */}
            <Text style={styles.title}>
              {config.content.headerText}
            </Text>

            {/* Subtítulo */}
            {config.content.showSubtitle && config.content.subtitleTemplate && (
              <Text style={styles.subtitle}>
                {config.content.subtitleTemplate}
              </Text>
            )}

            {/* Nombre del estudiante con estilo script */}
            <Text style={styles.studentName}>
              {data.student_name}
            </Text>

            {/* Divisor ornamentado */}
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
              <Divider
                style={config.ornaments.dividerStyle}
                color={config.colors.accent}
                secondaryColor={config.colors.secondary}
                width={250}
              />
            </View>

            {/* Curso */}
            <Text style={styles.courseName}>
              {data.course_name}
            </Text>

            {/* Detalles con estilo creativo */}
            <View style={styles.details}>
              {config.content.showDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Fecha ✦</Text>
                  <Text style={styles.detailValue}>{formatDate(data.issue_date)}</Text>
                </View>
              )}
              {config.content.showHours && data.hours && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Horas ✦</Text>
                  <Text style={styles.detailValue}>{data.hours}</Text>
                </View>
              )}
              {config.content.showGrade && data.grade && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>✦ Calificación ✦</Text>
                  <Text style={styles.detailValue}>{data.grade}%</Text>
                </View>
              )}
            </View>

            {/* Sello ribbon */}
            {config.ornaments.showSeal && (
              <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center' }}>
                <Seal
                  style={config.ornaments.sealStyle}
                  primaryColor={config.colors.primary}
                  accentColor={config.colors.accent}
                  size={100}
                />
              </View>
            )}

            {/* Firma */}
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                {config.branding.signatureImage && (
                  <Image src={config.branding.signatureImage} style={styles.signatureImage} />
                )}
                {config.layout.showSignatureLine && (
                  <View style={[styles.signatureLine, { borderStyle: 'dashed' }]} />
                )}
                {config.content.showInstructor && data.instructor_name && (
                  <Text style={styles.signatureName}>{data.instructor_name}</Text>
                )}
                {config.branding.signatureLabel && (
                  <Text style={[styles.signatureLabel, { fontStyle: 'italic' }]}>
                    {config.branding.signatureLabel}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {config.content.showQR && qrCodeDataUrl && (
                <View style={{ alignItems: 'flex-start' }}>
                  <Image src={qrCodeDataUrl} style={styles.qrCode} />
                </View>
              )}
            </View>

            <View style={styles.footerRight}>
              {config.content.showCertificateNumber && (
                <Text style={[styles.certificateNumber, { fontStyle: 'italic' }]}>
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
