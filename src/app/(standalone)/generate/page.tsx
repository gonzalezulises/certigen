'use client';

import React, { useState } from 'react';
import { CertificateForm, CertificatePreview, CertificatePDFButton } from '@/components/certificate';
import { Alert, AlertTitle, AlertDescription, Card, CardContent, CardHeader, CardTitle, Label, Select } from '@/components/ui';
import { CertificateFormData, TemplateStyle, PaperSize, PAPER_SIZES, Certificate } from '@/types/certificate';
import { CheckCircle2, Eye, FileText } from 'lucide-react';

export default function GeneratePage() {
  const [formData, setFormData] = useState<Partial<CertificateFormData>>({
    certificate_type: 'participation',
    issue_date: new Date().toISOString().split('T')[0],
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('elegant');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Generar Certificado</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Completa el formulario para generar un certificado verificable con codigo QR.
          </p>
        </div>

        {/* Alerts */}
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

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="order-2 xl:order-1">
            <CertificateForm
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              isLoading={isLoading}
            />
          </div>

          {/* Preview Section */}
          <div className="order-1 xl:order-2 xl:sticky xl:top-4 xl:self-start">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Paper Size Selector */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <Label htmlFor="paper-size" className="text-sm font-medium">Tamano de papel</Label>
                    <Select
                      id="paper-size"
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                      className="mt-1"
                    >
                      {Object.entries(PAPER_SIZES).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.name} ({config.width}mm x {config.height}mm)
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Certificate Preview */}
                <div className="bg-gray-100 rounded-lg p-2 sm:p-4 overflow-hidden">
                  <div className="w-full max-w-full overflow-auto">
                    <CertificatePreview
                      data={formData}
                      certificateNumber={generatedCertificate?.certificate_number}
                      template={selectedTemplate}
                      paperSize={paperSize}
                      className="shadow-lg mx-auto"
                    />
                  </div>
                </div>

                {/* Download Button */}
                {generatedCertificate && (
                  <div className="flex justify-center pt-2">
                    <CertificatePDFButton
                      elementId="certificate-preview"
                      fileName={`certificado-${generatedCertificate.certificate_number}.pdf`}
                      paperSize={paperSize}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
