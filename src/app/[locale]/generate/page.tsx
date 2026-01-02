'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { TemplateConfigurator } from '@/components/configurator/TemplateConfigurator';
import { TemplateConfig, TemplateId, CertificateData } from '@/lib/pdf/config/schema';
import { Alert, AlertTitle, AlertDescription, Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { CheckCircle2, FileSpreadsheet, Mail, Loader2, Info, User, BookOpen, GraduationCap } from 'lucide-react';

export default function GeneratePage() {
  const t = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<{
    certificate_number: string;
    pdfDataUrl: string;
    pdfBlob: Blob;
  } | null>(null);
  const [isPersisted, setIsPersisted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [savedConfig, setSavedConfig] = useState<{ templateId: TemplateId; config: TemplateConfig } | null>(null);
  const hasAutoDownloaded = useRef(false);

  // Certificate data form
  const [certificateData, setCertificateData] = useState<Partial<CertificateData>>({
    certificate_type: 'completion',
    issue_date: new Date().toISOString(),
  });

  const handleInputChange = useCallback((field: keyof CertificateData, value: string | number) => {
    setCertificateData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveConfig = useCallback((templateId: TemplateId, config: TemplateConfig) => {
    setSavedConfig({ templateId, config });
    setShowConfigurator(false);
  }, []);

  const handleGenerate = async (templateId: TemplateId, config: TemplateConfig, data: CertificateData) => {
    setIsGenerating(true);
    setError(null);
    setEmailSent(false);

    try {
      // First, register the certificate with the API
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: data.student_name,
          student_email: data.student_email,
          course_name: data.course_name,
          certificate_type: data.certificate_type,
          issue_date: data.issue_date,
          instructor_name: data.instructor_name,
          hours: data.hours,
          grade: data.grade,
          template_id: templateId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errors.serverError'));
      }

      // Update certificate data with the generated number
      const fullData: CertificateData = {
        ...data,
        certificate_number: result.certificate.certificate_number,
      };

      // Generate the PDF using server-side API
      const pdfResponse = await fetch('/api/certificates/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: fullData,
          templateId,
          config: {
            colors: config.colors,
            content: config.content,
            layout: config.layout,
            border: config.border,
            ornaments: config.ornaments,
            branding: config.branding,
          },
        }),
      });

      const pdfResult = await pdfResponse.json();

      if (!pdfResponse.ok) {
        throw new Error(pdfResult.error || 'Error generating PDF');
      }

      // Convert base64 to Blob for download
      const binaryString = atob(pdfResult.pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });

      setGeneratedCertificate({
        certificate_number: result.certificate.certificate_number,
        pdfDataUrl: pdfResult.pdfDataUrl,
        pdfBlob: pdfBlob,
      });
      setIsPersisted(result.persisted || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.serverError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = useCallback(() => {
    if (!generatedCertificate) return;

    const link = document.createElement('a');
    link.href = generatedCertificate.pdfDataUrl;
    link.download = `certificado-${generatedCertificate.certificate_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCertificate]);

  const handleSendEmail = async () => {
    if (!generatedCertificate || !certificateData.student_email) return;

    setIsSendingEmail(true);
    setError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(generatedCertificate.pdfBlob);
      });

      const response = await fetch('/api/certificates/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: certificateData.student_email,
          studentName: certificateData.student_name,
          courseName: certificateData.course_name,
          certificateNumber: generatedCertificate.certificate_number,
          certificateType: certificateData.certificate_type,
          issueDate: certificateData.issue_date,
          organizationName: savedConfig?.config.branding.organizationName,
          instructorName: certificateData.instructor_name,
          hours: certificateData.hours,
          grade: certificateData.grade,
          pdfBase64,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errors.serverError'));
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.serverError'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Auto-download PDF for anonymous users
  useEffect(() => {
    if (generatedCertificate && !isPersisted && !hasAutoDownloaded.current) {
      hasAutoDownloaded.current = true;
      // Small delay to let the user see the success message
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [generatedCertificate, isPersisted, handleDownloadPDF]);

  // Reset auto-download flag when generating a new certificate
  useEffect(() => {
    if (!generatedCertificate) {
      hasAutoDownloaded.current = false;
    }
  }, [generatedCertificate]);

  // If showing the configurator, render it full-screen
  if (showConfigurator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('configurator.title')}
            </h1>
            <Button variant="outline" onClick={() => setShowConfigurator(false)}>
              {t('configurator.back')}
            </Button>
          </div>
          <TemplateConfigurator
            onSave={handleSaveConfig}
            onGenerate={(templateId, config, data) => {
              handleGenerate(templateId, config, data);
              setShowConfigurator(false);
            }}
            initialTemplateId={savedConfig?.templateId}
            initialConfig={savedConfig?.config}
            certificateData={certificateData as CertificateData}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('generate.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              {t('generate.subtitle')}
            </p>
          </div>
          <Link href="/batch">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              {t('generate.batchLink')}
            </Button>
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="error" className="mb-6" role="alert">
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {generatedCertificate && (
          <Alert variant="success" className="mb-6" role="status">
            <AlertTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              {t('generate.success.title')}
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-1">
                <p>{t('generate.success.number')}: <span className="font-mono font-bold">{generatedCertificate.certificate_number}</span></p>
                {isPersisted ? (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {t('generate.success.persisted')}
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <Info className="h-4 w-4" aria-hidden="true" />
                    {t('generate.success.anonymous')}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Certificate Data Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('generate.student.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student_name">{t('generate.student.name')} *</Label>
                <Input
                  id="student_name"
                  value={certificateData.student_name || ''}
                  onChange={(e) => handleInputChange('student_name', e.target.value)}
                  placeholder={t('generate.student.namePlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="student_email">{t('generate.student.email')}</Label>
                <Input
                  id="student_email"
                  type="email"
                  value={certificateData.student_email || ''}
                  onChange={(e) => handleInputChange('student_email', e.target.value)}
                  placeholder={t('generate.student.emailPlaceholder')}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('generate.student.emailHint')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('generate.course.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="course_name">{t('generate.course.name')} *</Label>
                <Input
                  id="course_name"
                  value={certificateData.course_name || ''}
                  onChange={(e) => handleInputChange('course_name', e.target.value)}
                  placeholder={t('generate.course.namePlaceholder')}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">{t('generate.course.hours')}</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={certificateData.hours || ''}
                    onChange={(e) => handleInputChange('hours', parseInt(e.target.value) || 0)}
                    placeholder={t('generate.course.hoursPlaceholder')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="grade">{t('generate.course.grade')}</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    value={certificateData.grade || ''}
                    onChange={(e) => handleInputChange('grade', parseInt(e.target.value) || 0)}
                    placeholder={t('generate.course.gradePlaceholder')}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructor_name">{t('generate.course.instructor')}</Label>
                <Input
                  id="instructor_name"
                  value={certificateData.instructor_name || ''}
                  onChange={(e) => handleInputChange('instructor_name', e.target.value)}
                  placeholder={t('generate.course.instructorPlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="issue_date">{t('generate.course.issueDate')}</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={certificateData.issue_date?.split('T')[0] || ''}
                  onChange={(e) => handleInputChange('issue_date', new Date(e.target.value).toISOString())}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Configuration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {t('generate.template.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedConfig ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t(`configurator.templates.${savedConfig.templateId}.name`)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t(`configurator.templates.${savedConfig.templateId}.description`)}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowConfigurator(true)}>
                  {t('configurator.title')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('generate.template.elegantDesc')}
                </p>
                <Button onClick={() => setShowConfigurator(true)} className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {t('configurator.title')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setShowConfigurator(true)}
            disabled={!certificateData.student_name || !certificateData.course_name || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('configurator.generating')}
              </>
            ) : (
              <>
                <GraduationCap className="h-5 w-5" />
                {t('generate.actions.generate')}
              </>
            )}
          </Button>
        </div>

        {/* Generated Certificate Actions */}
        {generatedCertificate && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleDownloadPDF} className="gap-2">
                  {t('generate.actions.downloadPdf')}
                </Button>
                {certificateData.student_email && (
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || emailSent}
                    variant={emailSent ? 'outline' : 'default'}
                    className="gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('generate.actions.sending')}
                      </>
                    ) : emailSent ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {t('generate.actions.sent')}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        {t('generate.actions.sendEmail')}
                      </>
                    )}
                  </Button>
                )}
              </div>
              {emailSent && (
                <p className="text-center text-sm text-green-600 dark:text-green-400 mt-4">
                  {t('generate.actions.sent')} - {certificateData.student_email}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
