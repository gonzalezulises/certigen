import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
} from '@react-pdf/renderer';
import { CertificateTemplateProps, formatDate, getPageDimensions } from './base';
import { generateStyles } from '../utils/styles';
import { registerFonts } from '../fonts/register';
import { Divider } from '../primitives/dividers';

// Registrar fuentes
registerFonts();

export const MinimalTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  config,
  qrCodeDataUrl,
}) => {
  const styles = generateStyles(config);
  const paperSize = config.layout?.paperSize ?? 'A4';
  const orientation = config.layout?.orientation ?? 'landscape';
  const { width, height } = getPageDimensions(paperSize, orientation);

  // Defaults para evitar undefined
  const colors = {
    accent: config.colors?.accent ?? '#c9a227',
  };

  const ornaments = {
    dividerStyle: config.ornaments?.dividerStyle ?? 'simple',
  };

  const content = {
    showOrganizationName: config.content?.showOrganizationName ?? true,
    showDate: config.content?.showDate ?? true,
    showInstructor: config.content?.showInstructor ?? true,
    showQR: config.content?.showQR ?? true,
    headerText: config.content?.headerText ?? 'Certificado',
  };

  const branding = {
    logoUrl: config.branding?.logoUrl ?? '',
    organizationName: config.branding?.organizationName ?? '',
  };

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        <View style={styles.container}>
          {/* Header minimalista */}
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

          {/* Contenido centrado con mucho espacio */}
          <View style={styles.mainContent}>
            {/* Título simple */}
            <Text style={styles.title}>
              {content.headerText}
            </Text>

            {/* Nombre prominente */}
            <Text style={styles.studentName}>
              {data.student_name}
            </Text>

            {/* Línea divisoria sutil */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Divider
                style={ornaments.dividerStyle}
                color={colors.accent}
                width={150}
              />
            </View>

            {/* Curso */}
            <Text style={styles.courseName}>
              {data.course_name}
            </Text>

            {/* Fecha e instructor en una línea */}
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 30 }}>
              {content.showDate && (
                <Text style={styles.signatureLabel}>
                  {formatDate(data.issue_date)}
                </Text>
              )}
              {content.showInstructor && data.instructor_name && (
                <Text style={styles.signatureLabel}>
                  {data.instructor_name}
                </Text>
              )}
            </View>
          </View>

          {/* Footer centrado */}
          <View style={styles.footer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {content.showQR && qrCodeDataUrl && (
                <View style={{ alignItems: 'center' }}>
                  <Image src={qrCodeDataUrl} style={styles.qrCode} />
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
