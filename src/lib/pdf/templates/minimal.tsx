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
  const { width, height } = getPageDimensions(config.layout.paperSize, config.layout.orientation);

  return (
    <Document>
      <Page
        size={[width, height]}
        style={styles.page}
      >
        <View style={styles.container}>
          {/* Header minimalista */}
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

          {/* Contenido centrado con mucho espacio */}
          <View style={styles.mainContent}>
            {/* Título simple */}
            <Text style={styles.title}>
              {config.content.headerText}
            </Text>

            {/* Nombre prominente */}
            <Text style={styles.studentName}>
              {data.student_name}
            </Text>

            {/* Línea divisoria sutil */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Divider
                style={config.ornaments.dividerStyle}
                color={config.colors.accent}
                width={150}
              />
            </View>

            {/* Curso */}
            <Text style={styles.courseName}>
              {data.course_name}
            </Text>

            {/* Fecha e instructor en una línea */}
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 30 }}>
              {config.content.showDate && (
                <Text style={styles.signatureLabel}>
                  {formatDate(data.issue_date)}
                </Text>
              )}
              {config.content.showInstructor && data.instructor_name && (
                <Text style={styles.signatureLabel}>
                  {data.instructor_name}
                </Text>
              )}
            </View>
          </View>

          {/* Footer centrado */}
          <View style={styles.footer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {config.content.showQR && qrCodeDataUrl && (
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
