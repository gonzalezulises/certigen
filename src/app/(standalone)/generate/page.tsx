'use client';

import React, { useState } from 'react';
import { CertificateForm, CertificatePreview, CertificatePDFButton } from '@/components/certificate';
import { Alert, AlertTitle, AlertDescription, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { CertificateFormData, TemplateStyle, Certificate } from '@/types/certificate';
import { CheckCircle2, Eye } from 'lucide-react';

export default function GeneratePage() {
  const [formData, setFormData] = useState<Partial<CertificateFormData>>({
    certificate_type: 'participation',
    issue_date: new Date().toISOString().split('T')[0],
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('elegant');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (data: Partial<CertificateFormData>) => {
    setFormData(data);
  };

  const handleSubmit = async (data: CertificateFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          template_id: selectedTemplate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al generar el certificado');
      }

      setGeneratedCertificate(result.certificate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generar Certificado</h1>
        <p className="text-gray-600 mt-2">
          Completa el formulario para generar un certificado verificable con codigo QR.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedCertificate && (
        <Alert variant="success" className="mb-6">
          <AlertTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Certificado Generado Exitosamente
          </AlertTitle>
          <AlertDescription>
            Numero de certificado: <span className="font-mono font-bold">{generatedCertificate.certificate_number}</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <CertificateForm
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            isLoading={isLoading}
          />
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vista Previa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto bg-gray-100 rounded-lg p-4">
                <CertificatePreview
                  data={formData}
                  certificateNumber={generatedCertificate?.certificate_number}
                  template={selectedTemplate}
                  className="shadow-lg mx-auto"
                />
              </div>

              {generatedCertificate && (
                <div className="mt-4 flex justify-center">
                  <CertificatePDFButton
                    elementId="certificate-preview"
                    fileName={`certificado-${generatedCertificate.certificate_number}.pdf`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
