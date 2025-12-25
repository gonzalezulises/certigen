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
  const { width, height } = getPageDimensions(config.layout.paperSize, config.layout.orientation);
  const padding = paddingMap[config.border.padding];

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        <View style={styles.container}>
          {/* Esquinas ornamentadas */}
          {config.border.cornerStyle === 'ornate' && (
            <>
              <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <CornerOrnament color={config.colors.border} position="top-left" size={40} />
              </View>
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <CornerOrnament color={config.colors.border} position="top-right" size={40} />
              </View>
              <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <CornerOrnament color={config.colors.border} position="bottom-right" size={40} />
              </View>
              <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <CornerOrnament color={config.colors.border} position="bottom-left" size={40} />
              </View>
            </>
          )}

          {/* Header con logo */}
          <View style={styles.header}>
            {config.branding.logoUrl && (
              <View style={styles.headerRow}>
                <Image src={config.branding.logoUrl} style={styles.logo} />
              </View>
            )}
            {config.content.showOrganizationName && config.branding.organizationName && (
              <>
                <Text style={styles.organizationName}>
                  {config.branding.organizationName}
                </Text>
                {config.branding.organizationSubtitle && (
                  <Text style={styles.organizationSubtitle}>
                    {config.branding.organizationSubtitle}
                  </Text>
                )}
              </>
            )}
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {/* Título */}
            <Text style={styles.title}>{config.content.headerText}</Text>

            {/* Subtítulo */}
            {config.content.showSubtitle && config.content.subtitleTemplate && (
              <Text style={styles.subtitle}>{config.content.subtitleTemplate}</Text>
            )}

            {/* Nombre del estudiante */}
            <Text style={styles.studentName}>{data.student_name}</Text>

            {/* Divisor */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Divider
                style={config.ornaments.dividerStyle}
                color={config.colors.accent}
                width={200}
              />
            </View>

            {/* Nombre del curso */}
            <Text style={styles.courseName}>{data.course_name}</Text>

            {/* Detalles */}
            <View style={styles.details}>
              {config.content.showDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>{formatDate(data.issue_date)}</Text>
                </View>
              )}
              {config.content.showHours && data.hours && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duración</Text>
                  <Text style={styles.detailValue}>{data.hours} horas</Text>
                </View>
              )}
              {config.content.showGrade && data.grade && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Calificación</Text>
                  <Text style={styles.detailValue}>{data.grade}%</Text>
                </View>
              )}
            </View>

            {/* Sello */}
            {config.ornaments.showSeal && (
              <View style={{
                position: 'absolute',
                bottom: config.ornaments.sealPosition === 'bottom-center' ? 80 : 100,
                ...(config.ornaments.sealPosition === 'bottom-center'
                  ? { left: '50%', marginLeft: -40 }
                  : config.ornaments.sealPosition === 'bottom-right'
                    ? { right: 60 }
                    : { right: 60, top: 60 }
                ),
              }}>
                <Seal
                  style={config.ornaments.sealStyle}
                  primaryColor={config.colors.primary}
                  accentColor={config.colors.accent}
                  size={80}
                />
              </View>
            )}

            {/* Firma */}
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                {config.branding.signatureImage && (
                  <Image src={config.branding.signatureImage} style={styles.signatureImage} />
                )}
                {config.layout.showSignatureLine && <View style={styles.signatureLine} />}
                {config.content.showInstructor && data.instructor_name && (
                  <Text style={styles.signatureName}>{data.instructor_name}</Text>
                )}
                {config.branding.signatureLabel && (
                  <Text style={styles.signatureLabel}>{config.branding.signatureLabel}</Text>
                )}
              </View>

              {config.layout.signaturePosition === 'dual' && config.branding.secondSignatureLabel && (
                <View style={styles.signature}>
                  {config.branding.secondSignatureImage && (
                    <Image src={config.branding.secondSignatureImage} style={styles.signatureImage} />
                  )}
                  {config.layout.showSignatureLine && <View style={styles.signatureLine} />}
                  <Text style={styles.signatureLabel}>{config.branding.secondSignatureLabel}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {config.content.showCertificateNumber && (
                <Text style={styles.certificateNumber}>N° {data.certificate_number}</Text>
              )}
            </View>

            <View style={styles.footerRight}>
              {config.content.showQR && qrCodeDataUrl && (
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
