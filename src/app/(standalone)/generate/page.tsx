'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CertificateForm, CertificatePreview, CertificatePDFButton } from '@/components/certificate';
import { Alert, AlertTitle, AlertDescription, Card, CardContent, CardHeader, CardTitle, Label, Select, Button } from '@/components/ui';
import { CertificateFormData, TemplateStyle, PaperSize, PAPER_SIZES, Certificate } from '@/types/certificate';
import { CheckCircle2, Eye, FileText, FileSpreadsheet, Mail, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function GeneratePage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<Partial<CertificateFormData>>({
    certificate_type: 'participation',
    issue_date: new Date().toISOString().split('T')[0],
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('elegant');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
  const [isPersisted, setIsPersisted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (data: Partial<CertificateFormData>) => {
    setFormData(data);
  };

  const handleLogoChange = (url: string | null) => {
    setLogoUrl(url);
  };

  const generatePDFBase64 = async (): Promise<string | null> => {
    const element = document.getElementById('certificate-preview');
    if (!element) return null;

    const paper = PAPER_SIZES[paperSize];
    const renderWidth = 1200;
    const renderHeight = renderWidth / paper.aspectRatio;

    const originalStyle = element.getAttribute('style') || '';
    element.style.width = `${renderWidth}px`;
    element.style.height = `${renderHeight}px`;
    element.style.maxWidth = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      element.setAttribute('style', originalStyle);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: paperSize === 'legal' ? [355.6, 215.9] : 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

      // Get base64 without the data:application/pdf prefix
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      return pdfBase64;
    } catch {
      element.setAttribute('style', originalStyle);
      return null;
    }
  };

  const handleSendEmail = async () => {
    if (!generatedCertificate || !formData.student_email) return;

    setIsSendingEmail(true);
    setError(null);

    try {
      const pdfBase64 = await generatePDFBase64();

      const response = await fetch('/api/certificates/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.student_email,
          studentName: generatedCertificate.student_name,
          courseName: generatedCertificate.course_name,
          certificateNumber: generatedCertificate.certificate_number,
          certificateType: generatedCertificate.certificate_type,
          issueDate: generatedCertificate.issue_date,
          organizationName: formData.organization_name,
          instructorName: generatedCertificate.instructor_name,
          hours: generatedCertificate.hours,
          grade: generatedCertificate.grade,
          pdfBase64,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el correo');
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = async (data: CertificateFormData) => {
    setIsLoading(true);
    setError(null);
    setEmailSent(false);

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
      setIsPersisted(result.persisted || false);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Generar Certificado</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Completa el formulario para generar un certificado verificable con codigo QR.
            </p>
          </div>
          <Link href="/batch">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Generar en lote (CSV)
            </Button>
          </Link>
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
              <div className="space-y-1">
                <p>Numero de certificado: <span className="font-mono font-bold">{generatedCertificate.certificate_number}</span></p>
                {isPersisted ? (
                  <p className="text-sm text-green-700">
                    El certificado ha sido guardado en tu cuenta y puede ser validado.
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Modo anonimo: El certificado no se guarda. Descarga el PDF o inicia sesion para guardar.
                  </p>
                )}
              </div>
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
              onLogoChange={handleLogoChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              isLoading={isLoading}
              isAuthenticated={!!user}
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
                      logoUrl={logoUrl}
                      className="shadow-lg mx-auto"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {generatedCertificate && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-center gap-3">
                      <CertificatePDFButton
                        elementId="certificate-preview"
                        fileName={`certificado-${generatedCertificate.certificate_number}.pdf`}
                        paperSize={paperSize}
                      />
                      <Button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail || emailSent}
                        variant={emailSent ? 'outline' : 'default'}
                        className="gap-2"
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : emailSent ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Enviado
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            Enviar por Email
                          </>
                        )}
                      </Button>
                    </div>
                    {emailSent && (
                      <p className="text-center text-sm text-green-600">
                        Certificado enviado a {formData.student_email}
                      </p>
                    )}
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
