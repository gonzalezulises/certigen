'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { cn, formatDate, getCertificateTypeLabel, getValidationUrl } from '@/lib/utils';
import { CertificateFormData, TemplateStyle, PaperSize, PAPER_SIZES } from '@/types/certificate';

interface CertificatePreviewProps {
  data: Partial<CertificateFormData>;
  certificateNumber?: string;
  template?: TemplateStyle;
  paperSize?: PaperSize;
  className?: string;
}

export function CertificatePreview({
  data,
  certificateNumber = 'CER-XXXXXXXX-XXXXXX',
  template = 'elegant',
  paperSize = 'a4',
  className,
}: CertificatePreviewProps) {
  const validationUrl = getValidationUrl(certificateNumber);
  const paper = PAPER_SIZES[paperSize];

  // Common wrapper styles for proper scaling
  const wrapperStyle: React.CSSProperties = {
    aspectRatio: paper.cssAspect,
    width: '100%',
    maxWidth: '100%',
  };

  if (template === 'elegant') {
    return (
      <div
        className={cn(
          'relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white font-serif overflow-hidden',
          className
        )}
        style={wrapperStyle}
        id="certificate-preview"
      >
        {/* Border Frame */}
        <div className="absolute inset-[3%] border-4 border-yellow-500/60 pointer-events-none" />
        <div className="absolute inset-[4%] border border-yellow-500/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between p-[5%]">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-bold text-yellow-400 tracking-wider">
              CERTIFICADO
            </h1>
            <p className="mt-1 text-[clamp(0.75rem,2.5vw,1.25rem)] text-blue-200 uppercase tracking-widest">
              de {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </p>
          </div>

          {/* Body */}
          <div className="text-center flex-1 flex flex-col justify-center py-[3%]">
            <p className="text-[clamp(0.7rem,2vw,1rem)] text-blue-200">Se certifica que</p>
            <h2 className="text-[clamp(1.25rem,4vw,2.5rem)] font-bold text-yellow-400 my-[2%] border-b-2 border-yellow-500/30 pb-[2%] mx-auto px-[5%]">
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p className="text-[clamp(0.7rem,2vw,1rem)] text-blue-200 mt-[2%]">
              ha {data.certificate_type === 'completion' ? 'completado' : 'participado en'} satisfactoriamente el curso
            </p>
            <h3 className="text-[clamp(1rem,3vw,1.75rem)] font-semibold mt-[2%]">
              {data.course_name || 'Nombre del Curso'}
            </h3>

            <div className="flex justify-center gap-[5%] mt-[3%] text-[clamp(0.6rem,1.5vw,0.875rem)] text-blue-200">
              {data.hours && (
                <span>Duracion: {data.hours} horas</span>
              )}
              {data.grade && (
                <span>Calificacion: {data.grade}/100</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between gap-2">
            <div className="text-center min-w-0">
              <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] text-blue-200">Fecha de emision</p>
              <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>

            <div className="text-center min-w-0">
              <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] text-blue-200">Numero de certificado</p>
              <p className="font-mono text-[clamp(0.5rem,1.2vw,0.75rem)]">{certificateNumber}</p>
            </div>

            {data.instructor_name && (
              <div className="text-center min-w-0 hidden sm:block">
                <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] text-blue-200">Instructor</p>
                <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">{data.instructor_name}</p>
              </div>
            )}

            {/* QR Code */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="bg-white p-1 sm:p-2 rounded">
                <QRCode value={validationUrl} size={48} className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-blue-200 mt-1">Verificar</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div
        className={cn(
          'relative bg-white text-gray-800 font-sans overflow-hidden',
          className
        )}
        style={wrapperStyle}
        id="certificate-preview"
      >
        <div className="flex flex-col h-full justify-between text-center p-[6%]">
          {/* Header */}
          <div>
            <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] tracking-[0.3em] text-gray-400 uppercase">
              Certificado de
            </p>
            <h1 className="text-[clamp(1.25rem,3.5vw,2rem)] font-light mt-2 text-gray-700">
              {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </h1>
            <div className="w-12 sm:w-16 h-0.5 bg-gray-800 mx-auto mt-4 sm:mt-6" />
          </div>

          {/* Body */}
          <div className="py-[4%]">
            <p className="text-gray-500 text-[clamp(0.7rem,1.8vw,1rem)]">Otorgado a</p>
            <h2 className="text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold mt-[2%] text-gray-900">
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p className="text-gray-500 mt-[4%] text-[clamp(0.7rem,1.8vw,1rem)]">Por completar exitosamente</p>
            <h3 className="text-[clamp(1rem,2.5vw,1.5rem)] mt-2 text-gray-700">
              {data.course_name || 'Nombre del Curso'}
            </h3>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div className="text-left">
              <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] text-gray-400">
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
              <p className="text-[clamp(0.5rem,1.2vw,0.75rem)] text-gray-400 font-mono">{certificateNumber}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="border border-gray-200 p-1 sm:p-2">
                <QRCode value={validationUrl} size={40} className="w-8 h-8 sm:w-10 sm:h-10" />
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
      className={cn(
        'relative bg-white text-gray-800 font-serif border-4 sm:border-8 border-blue-900 overflow-hidden',
        className
      )}
      style={wrapperStyle}
      id="certificate-preview"
    >
      <div className="flex flex-col h-full p-[4%]">
        {/* Header */}
        <div className="text-center border-b-2 border-blue-900 pb-[3%]">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto mb-2 sm:mb-4 flex items-center justify-center text-gray-400 text-[clamp(0.4rem,1vw,0.75rem)]">
            LOGO
          </div>
          <h1 className="text-[clamp(1rem,2.5vw,1.75rem)] font-bold text-blue-900 tracking-wide">
            CERTIFICADO OFICIAL
          </h1>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col justify-center text-center py-[3%]">
          <p className="text-gray-600 text-[clamp(0.6rem,1.5vw,1rem)]">Por medio del presente se hace constar que</p>
          <h2 className="text-[clamp(1.25rem,3.5vw,2rem)] font-bold text-blue-900 my-[2%]">
            {data.student_name || 'Nombre del Estudiante'}
          </h2>
          <p className="text-gray-600 text-[clamp(0.6rem,1.5vw,1rem)]">
            Ha {data.certificate_type === 'completion' ? 'aprobado' : 'participado en'} satisfactoriamente el programa de formacion
          </p>
          <h3 className="text-[clamp(0.875rem,2vw,1.25rem)] text-gray-700 mt-[2%]">
            {data.course_name || 'Nombre del Curso'}
          </h3>

          <div className="flex justify-center gap-[6%] mt-[3%]">
            {data.hours && (
              <div className="text-center">
                <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-gray-400 uppercase">Duracion</p>
                <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">{data.hours} horas</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-gray-400 uppercase">Fecha</p>
              <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>
            {data.grade && (
              <div className="text-center">
                <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-gray-400 uppercase">Calificacion</p>
                <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">{data.grade}/100</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between border-t border-gray-200 pt-[2%]">
          <div className="text-center">
            <div className="w-24 sm:w-40 border-b border-gray-400 mb-2" />
            <p className="font-semibold text-[clamp(0.6rem,1.5vw,0.875rem)]">{data.instructor_name || 'Instructor'}</p>
            <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-gray-400">Instructor / Director</p>
          </div>

          <div className="text-center">
            <div className="border border-gray-200 p-1 sm:p-2 inline-block">
              <QRCode value={validationUrl} size={40} className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <p className="text-[clamp(0.4rem,1vw,0.625rem)] text-gray-400 mt-1 font-mono">{certificateNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
