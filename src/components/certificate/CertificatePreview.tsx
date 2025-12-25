'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { formatDate, getCertificateTypeLabel, getValidationUrl } from '@/lib/utils';
import { CertificateFormData, TemplateStyle, PaperSize, PAPER_SIZES } from '@/types/certificate';

interface CertificatePreviewProps {
  data: Partial<CertificateFormData>;
  certificateNumber?: string;
  template?: TemplateStyle;
  paperSize?: PaperSize;
  className?: string;
}

// Using inline hex colors to avoid html2canvas LAB color parsing issues
const colors = {
  // Blues
  blue900: '#1e3a5f',
  blue800: '#1e4976',
  blue700: '#2563eb',
  blue200: '#bfdbfe',
  blue100: '#dbeafe',
  blue600: '#2563eb',
  // Yellows
  yellow400: '#facc15',
  yellow500: '#eab308',
  // Grays
  gray900: '#111827',
  gray800: '#1f2937',
  gray700: '#374151',
  gray600: '#4b5563',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50: '#f9fafb',
  // Others
  white: '#ffffff',
};

export function CertificatePreview({
  data,
  certificateNumber = 'CER-XXXXXXXX-XXXXXX',
  template = 'elegant',
  paperSize = 'a4',
  className = '',
}: CertificatePreviewProps) {
  const validationUrl = getValidationUrl(certificateNumber);
  const paper = PAPER_SIZES[paperSize];

  const wrapperStyle: React.CSSProperties = {
    aspectRatio: paper.cssAspect,
    width: '100%',
    maxWidth: '100%',
  };

  if (template === 'elegant') {
    return (
      <div
        className={className}
        style={{
          ...wrapperStyle,
          background: `linear-gradient(135deg, ${colors.blue900} 0%, ${colors.blue800} 50%, ${colors.blue700} 100%)`,
          color: colors.white,
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
        id="certificate-preview"
      >
        {/* Border Frame */}
        <div style={{
          position: 'absolute',
          inset: '3%',
          border: `4px solid ${colors.yellow500}99`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          inset: '4%',
          border: `1px solid ${colors.yellow500}66`,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '5%',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: 'bold',
              color: colors.yellow400,
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              CERTIFICADO
            </h1>
            <p style={{
              marginTop: '0.5rem',
              fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)',
              color: colors.blue200,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              de {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </p>
          </div>

          {/* Body */}
          <div style={{
            textAlign: 'center',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '3% 0',
          }}>
            <p style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)', color: colors.blue200, margin: 0 }}>
              Se certifica que
            </p>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              color: colors.yellow400,
              margin: '2% auto',
              borderBottom: `2px solid ${colors.yellow500}4d`,
              paddingBottom: '2%',
              paddingLeft: '5%',
              paddingRight: '5%',
            }}>
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)', color: colors.blue200, marginTop: '2%' }}>
              ha {data.certificate_type === 'completion' ? 'completado' : 'participado en'} satisfactoriamente el curso
            </p>
            <h3 style={{
              fontSize: 'clamp(1rem, 3vw, 1.75rem)',
              fontWeight: 600,
              marginTop: '2%',
              color: colors.white,
            }}>
              {data.course_name || 'Nombre del Curso'}
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '5%',
              marginTop: '3%',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)',
              color: colors.blue200,
            }}>
              {data.hours && <span>Duracion: {data.hours} horas</span>}
              {data.grade && <span>Calificacion: {data.grade}/100</span>}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '8px',
          }}>
            <div style={{ textAlign: 'center', minWidth: 0 }}>
              <p style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', color: colors.blue200, margin: 0 }}>
                Fecha de emision
              </p>
              <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: '4px 0 0 0' }}>
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>

            <div style={{ textAlign: 'center', minWidth: 0 }}>
              <p style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', color: colors.blue200, margin: 0 }}>
                Numero de certificado
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', margin: '4px 0 0 0' }}>
                {certificateNumber}
              </p>
            </div>

            {data.instructor_name && (
              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <p style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', color: colors.blue200, margin: 0 }}>
                  Instructor
                </p>
                <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: '4px 0 0 0' }}>
                  {data.instructor_name}
                </p>
              </div>
            )}

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ backgroundColor: colors.white, padding: '8px', borderRadius: '4px' }}>
                <QRCode value={validationUrl} size={48} />
              </div>
              <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.blue200, marginTop: '4px' }}>
                Verificar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div
        className={className}
        style={{
          ...wrapperStyle,
          backgroundColor: colors.white,
          color: colors.gray800,
          fontFamily: 'Helvetica, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
        id="certificate-preview"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          textAlign: 'center',
          padding: '6%',
        }}>
          {/* Header */}
          <div>
            <p style={{
              fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)',
              letterSpacing: '0.3em',
              color: colors.gray400,
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Certificado de
            </p>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
              fontWeight: 300,
              marginTop: '8px',
              color: colors.gray700,
            }}>
              {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </h1>
            <div style={{
              width: '64px',
              height: '2px',
              backgroundColor: colors.gray800,
              margin: '24px auto 0',
            }} />
          </div>

          {/* Body */}
          <div style={{ padding: '4% 0' }}>
            <p style={{ color: colors.gray500, fontSize: 'clamp(0.7rem, 1.8vw, 1rem)', margin: 0 }}>
              Otorgado a
            </p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4.5vw, 2.75rem)',
              fontWeight: 600,
              marginTop: '2%',
              color: colors.gray900,
            }}>
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p style={{ color: colors.gray500, marginTop: '4%', fontSize: 'clamp(0.7rem, 1.8vw, 1rem)' }}>
              Por completar exitosamente
            </p>
            <h3 style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              marginTop: '8px',
              color: colors.gray700,
              fontWeight: 400,
            }}>
              {data.course_name || 'Nombre del Curso'}
            </h3>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', color: colors.gray400, margin: 0 }}>
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
              <p style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)', color: colors.gray400, fontFamily: 'monospace', margin: '4px 0 0 0' }}>
                {certificateNumber}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ border: `1px solid ${colors.gray200}`, padding: '8px' }}>
                <QRCode value={validationUrl} size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Corporate template
  return (
    <div
      className={className}
      style={{
        ...wrapperStyle,
        backgroundColor: colors.white,
        color: colors.gray800,
        fontFamily: 'Georgia, serif',
        border: `8px solid ${colors.blue900}`,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      id="certificate-preview"
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '4%',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: `2px solid ${colors.blue900}`,
          paddingBottom: '3%',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: colors.gray200,
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.gray400,
            fontSize: 'clamp(0.4rem, 1vw, 0.75rem)',
          }}>
            LOGO
          </div>
          <h1 style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
            fontWeight: 'bold',
            color: colors.blue900,
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            CERTIFICADO OFICIAL
          </h1>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3% 0',
        }}>
          <p style={{ color: colors.gray600, fontSize: 'clamp(0.6rem, 1.5vw, 1rem)', margin: 0 }}>
            Por medio del presente se hace constar que
          </p>
          <h2 style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
            fontWeight: 'bold',
            color: colors.blue900,
            margin: '2% 0',
          }}>
            {data.student_name || 'Nombre del Estudiante'}
          </h2>
          <p style={{ color: colors.gray600, fontSize: 'clamp(0.6rem, 1.5vw, 1rem)', margin: 0 }}>
            Ha {data.certificate_type === 'completion' ? 'aprobado' : 'participado en'} satisfactoriamente el programa de formacion
          </p>
          <h3 style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
            color: colors.gray700,
            marginTop: '2%',
            fontWeight: 400,
          }}>
            {data.course_name || 'Nombre del Curso'}
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6%',
            marginTop: '3%',
          }}>
            {data.hours && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.gray400, textTransform: 'uppercase', margin: 0 }}>
                  Duracion
                </p>
                <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: '4px 0 0 0' }}>
                  {data.hours} horas
                </p>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.gray400, textTransform: 'uppercase', margin: 0 }}>
                Fecha
              </p>
              <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: '4px 0 0 0' }}>
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>
            {data.grade && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.gray400, textTransform: 'uppercase', margin: 0 }}>
                  Calificacion
                </p>
                <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: '4px 0 0 0' }}>
                  {data.grade}/100
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderTop: `1px solid ${colors.gray200}`,
          paddingTop: '2%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '160px', borderBottom: `1px solid ${colors.gray400}`, marginBottom: '8px' }} />
            <p style={{ fontWeight: 600, fontSize: 'clamp(0.6rem, 1.5vw, 0.875rem)', margin: 0 }}>
              {data.instructor_name || 'Instructor'}
            </p>
            <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.gray400, margin: '4px 0 0 0' }}>
              Instructor / Director
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ border: `1px solid ${colors.gray200}`, padding: '8px', display: 'inline-block' }}>
              <QRCode value={validationUrl} size={40} />
            </div>
            <p style={{ fontSize: 'clamp(0.4rem, 1vw, 0.625rem)', color: colors.gray400, marginTop: '4px', fontFamily: 'monospace' }}>
              {certificateNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
