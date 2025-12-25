'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { cn, formatDate, getCertificateTypeLabel, getValidationUrl } from '@/lib/utils';
import { CertificateFormData, TemplateStyle } from '@/types/certificate';

interface CertificatePreviewProps {
  data: Partial<CertificateFormData>;
  certificateNumber?: string;
  template?: TemplateStyle;
  className?: string;
}

export function CertificatePreview({
  data,
  certificateNumber = 'CER-XXXXXXXX-XXXXXX',
  template = 'elegant',
  className,
}: CertificatePreviewProps) {
  const validationUrl = getValidationUrl(certificateNumber);

  if (template === 'elegant') {
    return (
      <div
        className={cn(
          'relative aspect-[1.414/1] w-full max-w-3xl bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white font-serif',
          className
        )}
        id="certificate-preview"
      >
        {/* Border Frame */}
        <div className="absolute inset-4 border-4 border-yellow-500/60 pointer-events-none" />
        <div className="absolute inset-6 border border-yellow-500/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 tracking-wider">
              CERTIFICADO
            </h1>
            <p className="mt-2 text-xl text-blue-200 uppercase tracking-widest">
              de {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </p>
          </div>

          {/* Body */}
          <div className="text-center flex-1 flex flex-col justify-center py-8">
            <p className="text-lg text-blue-200">Se certifica que</p>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 my-4 border-b-2 border-yellow-500/30 pb-4 mx-auto px-8">
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p className="text-lg text-blue-200 mt-4">
              ha {data.certificate_type === 'completion' ? 'completado' : 'participado en'} satisfactoriamente el curso
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold mt-4">
              {data.course_name || 'Nombre del Curso'}
            </h3>

            <div className="flex justify-center gap-8 mt-6 text-sm text-blue-200">
              {data.hours && (
                <span>Duracion: {data.hours} horas</span>
              )}
              {data.grade && (
                <span>Calificacion: {data.grade}/100</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div className="text-center">
              <p className="text-sm text-blue-200">Fecha de emision</p>
              <p className="font-semibold">
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-blue-200">Numero de certificado</p>
              <p className="font-mono text-sm">{certificateNumber}</p>
            </div>

            {data.instructor_name && (
              <div className="text-center">
                <p className="text-sm text-blue-200">Instructor</p>
                <p className="font-semibold">{data.instructor_name}</p>
              </div>
            )}

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded">
                <QRCode value={validationUrl} size={64} />
              </div>
              <p className="text-xs text-blue-200 mt-1">Verificar</p>
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
          'relative aspect-[1.414/1] w-full max-w-3xl bg-white p-12 text-gray-800 font-sans',
          className
        )}
        id="certificate-preview"
      >
        <div className="flex flex-col h-full justify-between text-center">
          {/* Header */}
          <div>
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Certificado de
            </p>
            <h1 className="text-3xl font-light mt-2 text-gray-700">
              {getCertificateTypeLabel(data.certificate_type || 'participation')}
            </h1>
            <div className="w-16 h-0.5 bg-gray-800 mx-auto mt-6" />
          </div>

          {/* Body */}
          <div className="py-8">
            <p className="text-gray-500">Otorgado a</p>
            <h2 className="text-4xl font-semibold mt-4 text-gray-900">
              {data.student_name || 'Nombre del Estudiante'}
            </h2>
            <p className="text-gray-500 mt-6">Por completar exitosamente</p>
            <h3 className="text-2xl mt-2 text-gray-700">
              {data.course_name || 'Nombre del Curso'}
            </h3>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div className="text-left">
              <p className="text-xs text-gray-400">{data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}</p>
              <p className="text-xs text-gray-400 font-mono">{certificateNumber}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="border border-gray-200 p-2">
                <QRCode value={validationUrl} size={48} />
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
        'relative aspect-[1.414/1] w-full max-w-3xl bg-white p-6 text-gray-800 font-serif border-8 border-blue-900',
        className
      )}
      id="certificate-preview"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center border-b-2 border-blue-900 pb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 text-xs">
            LOGO
          </div>
          <h1 className="text-2xl font-bold text-blue-900 tracking-wide">
            CERTIFICADO OFICIAL
          </h1>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col justify-center text-center py-6">
          <p className="text-gray-600">Por medio del presente se hace constar que</p>
          <h2 className="text-3xl font-bold text-blue-900 my-4">
            {data.student_name || 'Nombre del Estudiante'}
          </h2>
          <p className="text-gray-600">
            Ha {data.certificate_type === 'completion' ? 'aprobado' : 'participado en'} satisfactoriamente el programa de formacion
          </p>
          <h3 className="text-xl text-gray-700 mt-4">
            {data.course_name || 'Nombre del Curso'}
          </h3>

          <div className="flex justify-center gap-12 mt-6">
            {data.hours && (
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase">Duracion</p>
                <p className="font-semibold">{data.hours} horas</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase">Fecha</p>
              <p className="font-semibold">
                {data.issue_date ? formatDate(data.issue_date) : formatDate(new Date().toISOString())}
              </p>
            </div>
            {data.grade && (
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase">Calificacion</p>
                <p className="font-semibold">{data.grade}/100</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between border-t border-gray-200 pt-4">
          <div className="text-center">
            <div className="w-40 border-b border-gray-400 mb-2" />
            <p className="font-semibold">{data.instructor_name || 'Instructor'}</p>
            <p className="text-xs text-gray-400">Instructor / Director</p>
          </div>

          <div className="text-center">
            <div className="border border-gray-200 p-2 inline-block">
              <QRCode value={validationUrl} size={48} />
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">{certificateNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
