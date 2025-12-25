import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
} from '@react-pdf/renderer';
import { CertificateTemplateProps, formatDate, getPageDimensions } from './base';
import { generateStyles, paddingMap } from '../utils/styles';
import { registerFonts } from '../fonts/register';
import { CornerOrnament } from '../primitives/ornaments';
import { Divider } from '../primitives/dividers';
import { Seal } from '../primitives/seals';

// Registrar fuentes
registerFonts();

export const ClassicTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  config,
  qrCodeDataUrl,
}) => {
  const styles = generateStyles(config);
  const paperSize = config.layout?.paperSize ?? 'A4';
  const orientation = config.layout?.orientation ?? 'landscape';
  const { width, height } = getPageDimensions(paperSize, orientation);
  const padding = paddingMap[config.border?.padding ?? 'normal'] ?? paddingMap.normal;

  // Defaults para colores y estilos
  const colors = {
    border: config.colors?.border ?? '#d4af37',
    accent: config.colors?.accent ?? '#c9a227',
    primary: config.colors?.primary ?? '#1a365d',
  };

  const border = {
    cornerStyle: config.border?.cornerStyle ?? 'none',
  };

  const ornaments = {
    dividerStyle: config.ornaments?.dividerStyle ?? 'simple',
    showSeal: config.ornaments?.showSeal ?? false,
    sealStyle: config.ornaments?.sealStyle ?? 'classic',
    sealPosition: config.ornaments?.sealPosition ?? 'bottom-right',
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
    headerText: config.content?.headerText ?? 'Certificado de Finalización',
    subtitleTemplate: config.content?.subtitleTemplate ?? '',
  };

  const layout = {
    showSignatureLine: config.layout?.showSignatureLine ?? true,
    signaturePosition: config.layout?.signaturePosition ?? 'center',
  };

  const branding = {
    logoUrl: config.branding?.logoUrl ?? '',
    organizationName: config.branding?.organizationName ?? '',
    organizationSubtitle: config.branding?.organizationSubtitle ?? '',
    signatureImage: config.branding?.signatureImage ?? '',
    signatureLabel: config.branding?.signatureLabel ?? '',
    secondSignatureImage: config.branding?.secondSignatureImage ?? '',
    secondSignatureLabel: config.branding?.secondSignatureLabel ?? '',
  };

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        <View style={styles.container}>
          {/* Esquinas ornamentadas */}
          {border.cornerStyle === 'ornate' && (
            <>
              <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <CornerOrnament color={colors.border} position="top-left" size={40} />
              </View>
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <CornerOrnament color={colors.border} position="top-right" size={40} />
              </View>
              <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <CornerOrnament color={colors.border} position="bottom-right" size={40} />
              </View>
              <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <CornerOrnament color={colors.border} position="bottom-left" size={40} />
              </View>
            </>
          )}

          {/* Header con logo */}
          <View style={styles.header}>
            {branding.logoUrl && (
              <View style={styles.headerRow}>
                <Image src={branding.logoUrl} style={styles.logo} />
              </View>
            )}
            {content.showOrganizationName && branding.organizationName && (
              <>
                <Text style={styles.organizationName}>
                  {branding.organizationName}
                </Text>
                {branding.organizationSubtitle && (
                  <Text style={styles.organizationSubtitle}>
                    {branding.organizationSubtitle}
                  </Text>
                )}
              </>
            )}
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {/* Título */}
            <Text style={styles.title}>{content.headerText}</Text>

            {/* Subtítulo */}
            {content.showSubtitle && content.subtitleTemplate && (
              <Text style={styles.subtitle}>{content.subtitleTemplate}</Text>
            )}

            {/* Nombre del estudiante */}
            <Text style={styles.studentName}>{data.student_name}</Text>

            {/* Divisor */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Divider
                style={ornaments.dividerStyle}
                color={colors.accent}
                width={200}
              />
            </View>

            {/* Nombre del curso */}
            <Text style={styles.courseName}>{data.course_name}</Text>

            {/* Detalles */}
            <View style={styles.details}>
              {content.showDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>{formatDate(data.issue_date)}</Text>
                </View>
              )}
              {content.showHours && data.hours && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duración</Text>
                  <Text style={styles.detailValue}>{data.hours} horas</Text>
                </View>
              )}
              {content.showGrade && data.grade && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Calificación</Text>
                  <Text style={styles.detailValue}>{data.grade}%</Text>
                </View>
              )}
            </View>

            {/* Sello */}
            {ornaments.showSeal && (
              <View style={{
                position: 'absolute',
                bottom: ornaments.sealPosition === 'bottom-center' ? 80 : 100,
                ...(ornaments.sealPosition === 'bottom-center'
                  ? { left: '50%', marginLeft: -40 }
                  : ornaments.sealPosition === 'bottom-right'
                    ? { right: 60 }
                    : { right: 60, top: 60 }
                ),
              }}>
                <Seal
                  style={ornaments.sealStyle}
                  primaryColor={colors.primary}
                  accentColor={colors.accent}
                  size={80}
                />
              </View>
            )}

            {/* Firma */}
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                {branding.signatureImage && (
                  <Image src={branding.signatureImage} style={styles.signatureImage} />
                )}
                {layout.showSignatureLine && <View style={styles.signatureLine} />}
                {content.showInstructor && data.instructor_name && (
                  <Text style={styles.signatureName}>{data.instructor_name}</Text>
                )}
                {branding.signatureLabel && (
                  <Text style={styles.signatureLabel}>{branding.signatureLabel}</Text>
                )}
              </View>

              {layout.signaturePosition === 'dual' && branding.secondSignatureLabel && (
                <View style={styles.signature}>
                  {branding.secondSignatureImage && (
                    <Image src={branding.secondSignatureImage} style={styles.signatureImage} />
                  )}
                  {layout.showSignatureLine && <View style={styles.signatureLine} />}
                  <Text style={styles.signatureLabel}>{branding.secondSignatureLabel}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {content.showCertificateNumber && (
                <Text style={styles.certificateNumber}>N° {data.certificate_number}</Text>
              )}
            </View>

            <View style={styles.footerRight}>
              {content.showQR && qrCodeDataUrl && (
                <View style={{ alignItems: 'center' }}>
                  <Image src={qrCodeDataUrl} style={styles.qrCode} />
                  <Text style={styles.qrLabel}>Escanea para verificar</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
