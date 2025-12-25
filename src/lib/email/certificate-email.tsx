import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img,
} from '@react-email/components';

interface CertificateEmailProps {
  studentName: string;
  courseName: string;
  certificateNumber: string;
  certificateType: 'participation' | 'completion';
  issueDate: string;
  organizationName?: string;
  instructorName?: string;
  hours?: number;
  grade?: number;
  validationUrl: string;
  pdfAttached?: boolean;
}

export function CertificateEmail({
  studentName,
  courseName,
  certificateNumber,
  certificateType,
  issueDate,
  organizationName,
  instructorName,
  hours,
  grade,
  validationUrl,
  pdfAttached = true,
}: CertificateEmailProps) {
  const typeLabel = certificateType === 'completion' ? 'Aprobacion' : 'Participacion';

  return (
    <Html>
      <Head />
      <Preview>Tu certificado de {typeLabel} - {courseName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            {organizationName && (
              <Text style={orgName}>{organizationName}</Text>
            )}
            <Heading style={h1}>Certificado de {typeLabel}</Heading>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hola {studentName},</Text>

            <Text style={paragraph}>
              Nos complace informarte que has {certificateType === 'completion' ? 'completado exitosamente' : 'participado en'} el curso:
            </Text>

            <Text style={courseTitle}>{courseName}</Text>

            {/* Course Details */}
            <Section style={detailsBox}>
              <Text style={detailRow}>
                <strong>Numero de Certificado:</strong> {certificateNumber}
              </Text>
              <Text style={detailRow}>
                <strong>Fecha de Emision:</strong> {issueDate}
              </Text>
              {hours && (
                <Text style={detailRow}>
                  <strong>Duracion:</strong> {hours} horas
                </Text>
              )}
              {grade && (
                <Text style={detailRow}>
                  <strong>Calificacion:</strong> {grade}/100
                </Text>
              )}
              {instructorName && (
                <Text style={detailRow}>
                  <strong>Instructor:</strong> {instructorName}
                </Text>
              )}
            </Section>

            {pdfAttached && (
              <Text style={paragraph}>
                Adjunto a este correo encontraras tu certificado en formato PDF.
              </Text>
            )}

            <Text style={paragraph}>
              Puedes verificar la autenticidad de tu certificado en cualquier momento utilizando el codigo QR incluido o visitando el siguiente enlace:
            </Text>

            <Section style={buttonContainer}>
              <Link href={validationUrl} style={button}>
                Verificar Certificado
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un correo automatico. Por favor no responder a este mensaje.
            </Text>
            <Text style={footerText}>
              {organizationName || 'CertiGen'} - Sistema de Generación y Validación de Certificados con QR
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 48px 0',
  textAlign: 'center' as const,
};

const orgName = {
  color: '#6b7280',
  fontSize: '14px',
  marginBottom: '8px',
};

const h1 = {
  color: '#1e3a5f',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 48px',
};

const content = {
  padding: '0 48px',
};

const greeting = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
};

const courseTitle = {
  color: '#1e3a5f',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  backgroundColor: '#f0f9ff',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '24px',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px 24px',
  marginBottom: '24px',
};

const detailRow = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  padding: '0 48px',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginBottom: '4px',
};

export default CertificateEmail;
