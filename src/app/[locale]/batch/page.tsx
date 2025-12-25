'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Input, Label, Select, Card, CardContent, CardHeader, CardTitle, Alert, AlertTitle, AlertDescription } from '@/components/ui';
import { CertificatePreview } from '@/components/certificate';
import { TemplateStyle, PaperSize, PAPER_SIZES, TEMPLATES, Certificate } from '@/types/certificate';
import { Upload, FileSpreadsheet, Download, ArrowLeft, CheckCircle2, AlertCircle, X, Image as ImageIcon, Loader2, Mail, Info } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/context/AuthContext';

interface CSVStudent {
  student_name: string;
  student_email: string;
  grade?: number;
  hours?: number;
}

export default function BatchPage() {
  const t = useTranslations();
  const { user } = useAuth();

  const [csvData, setCsvData] = useState<CSVStudent[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [certificateType, setCertificateType] = useState<'participation' | 'completion'>('participation');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('elegant');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [defaultHours, setDefaultHours] = useState<number | undefined>();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState<Certificate[]>([]);
  const [isPersisted, setIsPersisted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [emailsSent, setEmailsSent] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): CSVStudent[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const nameIndex = headers.findIndex(h => h.includes('nombre') || h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('correo'));
    const gradeIndex = headers.findIndex(h => h.includes('calificacion') || h.includes('grade') || h.includes('nota'));
    const hoursIndex = headers.findIndex(h => h.includes('horas') || h.includes('hours'));

    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error(t('batch.csvFormat.required'));
    }

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        student_name: values[nameIndex] || '',
        student_email: values[emailIndex] || '',
        grade: gradeIndex !== -1 && values[gradeIndex] ? parseFloat(values[gradeIndex]) : undefined,
        hours: hoursIndex !== -1 && values[hoursIndex] ? parseInt(values[hoursIndex]) : undefined,
      };
    }).filter(s => s.student_name && s.student_email);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert(t('errors.invalidFormat', { formats: 'CSV' }));
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setCsvData(data);
        setErrors([]);
      } catch (err) {
        alert(err instanceof Error ? err.message : t('errors.serverError'));
        setCsvData([]);
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(t('errors.invalidFormat', { formats: 'PNG, JPG' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert(t('errors.fileTooLarge', { max: '2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCertificates = async () => {
    if (!courseName.trim()) {
      alert(t('errors.required'));
      return;
    }

    setIsGenerating(true);
    setErrors([]);
    setGeneratedCertificates([]);
    setProgress({ current: 0, total: csvData.length });

    const generated: Certificate[] = [];
    const errorList: string[] = [];

    for (let i = 0; i < csvData.length; i++) {
      const student = csvData[i];
      setProgress({ current: i + 1, total: csvData.length });

      try {
        const response = await fetch('/api/certificates/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: student.student_name,
            student_email: student.student_email,
            course_name: courseName,
            certificate_type: certificateType,
            instructor_name: instructorName || undefined,
            hours: student.hours || defaultHours || undefined,
            grade: student.grade || undefined,
            issue_date: issueDate,
            organization_name: organizationName || undefined,
          }),
        });

        const result = await response.json();

        if (response.ok && result.certificate) {
          generated.push(result.certificate);
          if (generated.length === 1 && result.persisted !== undefined) {
            setIsPersisted(result.persisted);
          }
        } else {
          errorList.push(`${i + 2}: ${result.error || t('errors.serverError')}`);
        }
      } catch {
        errorList.push(`${i + 2}: ${t('errors.networkError')}`);
      }

      await new Promise(r => setTimeout(r, 100));
    }

    setGeneratedCertificates(generated);
    setErrors(errorList);
    setIsGenerating(false);
  };

  const downloadAllAsPDF = async () => {
    if (generatedCertificates.length === 0) return;

    setIsGenerating(true);
    const zip = new JSZip();
    const paper = PAPER_SIZES[paperSize];

    for (let i = 0; i < generatedCertificates.length; i++) {
      const cert = generatedCertificates[i];
      setProgress({ current: i + 1, total: generatedCertificates.length });

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '1200px';
      document.body.appendChild(container);

      const { createRoot } = await import('react-dom/client');
      const root = createRoot(container);

      await new Promise<void>((resolve) => {
        root.render(
          <CertificatePreview
            data={{
              student_name: cert.student_name,
              student_email: cert.student_email,
              course_name: cert.course_name,
              certificate_type: cert.certificate_type,
              instructor_name: cert.instructor_name || undefined,
              hours: cert.hours || undefined,
              grade: cert.grade || undefined,
              issue_date: cert.issue_date,
              organization_name: organizationName || undefined,
            }}
            certificateNumber={cert.certificate_number}
            template={selectedTemplate}
            paperSize={paperSize}
            logoUrl={logoUrl}
          />
        );
        setTimeout(resolve, 200);
      });

      const element = container.querySelector('[id="certificate-preview"]') as HTMLElement;
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: paperSize === 'legal' ? [355.6, 215.9] : 'a4',
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

        zip.file(`certificado-${cert.certificate_number}.pdf`, pdf.output('blob'));
      }

      root.unmount();
      document.body.removeChild(container);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificados-${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const sendAllEmails = async () => {
    if (generatedCertificates.length === 0) return;

    setIsSendingEmails(true);
    setEmailErrors([]);
    setEmailsSent(0);
    setProgress({ current: 0, total: generatedCertificates.length });

    const paper = PAPER_SIZES[paperSize];
    const errorList: string[] = [];
    let sentCount = 0;

    for (let i = 0; i < generatedCertificates.length; i++) {
      const cert = generatedCertificates[i];
      setProgress({ current: i + 1, total: generatedCertificates.length });

      try {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '1200px';
        document.body.appendChild(container);

        const { createRoot } = await import('react-dom/client');
        const root = createRoot(container);

        await new Promise<void>((resolve) => {
          root.render(
            <CertificatePreview
              data={{
                student_name: cert.student_name,
                student_email: cert.student_email,
                course_name: cert.course_name,
                certificate_type: cert.certificate_type,
                instructor_name: cert.instructor_name || undefined,
                hours: cert.hours || undefined,
                grade: cert.grade || undefined,
                issue_date: cert.issue_date,
                organization_name: organizationName || undefined,
              }}
              certificateNumber={cert.certificate_number}
              template={selectedTemplate}
              paperSize={paperSize}
              logoUrl={logoUrl}
            />
          );
          setTimeout(resolve, 200);
        });

        const element = container.querySelector('[id="certificate-preview"]') as HTMLElement;
        let pdfBase64: string | null = null;

        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
          });

          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: paperSize === 'legal' ? [355.6, 215.9] : 'a4',
          });

          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);
          pdfBase64 = pdf.output('datauristring').split(',')[1];
        }

        root.unmount();
        document.body.removeChild(container);

        const response = await fetch('/api/certificates/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cert.student_email,
            studentName: cert.student_name,
            courseName: cert.course_name,
            certificateNumber: cert.certificate_number,
            certificateType: cert.certificate_type,
            issueDate: cert.issue_date,
            organizationName: organizationName || undefined,
            instructorName: cert.instructor_name,
            hours: cert.hours,
            grade: cert.grade,
            pdfBase64,
          }),
        });

        if (response.ok) {
          sentCount++;
          setEmailsSent(sentCount);
        } else {
          const result = await response.json();
          errorList.push(`${cert.student_email}: ${result.error || t('errors.serverError')}`);
        }
      } catch {
        errorList.push(`${cert.student_email}: ${t('errors.networkError')}`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    setEmailErrors(errorList);
    setIsSendingEmails(false);
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('batch.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('batch.requiresAuth')}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/admin/auth">
                <Button>{t('batch.login')}</Button>
              </Link>
              <Link href="/admin/auth">
                <Button variant="outline">{t('batch.register')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/generate">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('common.cancel')}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('batch.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {t('batch.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CSV Upload & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* CSV Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
                  {t('batch.upload.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                    tabIndex={0}
                    role="button"
                    aria-label={t('batch.upload.dragDrop')}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      aria-describedby="csv-hint"
                    />
                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" aria-hidden="true" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {fileName || t('batch.upload.dragDrop')}
                    </p>
                    <p id="csv-hint" className="text-xs text-gray-400 mt-2">
                      {t('batch.upload.hint')}
                    </p>
                  </div>

                  {csvData.length > 0 && (
                    <Alert variant="success">
                      <AlertTitle>{t('batch.upload.selected')}</AlertTitle>
                      <AlertDescription>
                        {t('batch.preview.rows', { count: csvData.length })}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('batch.settings.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organization & Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">{t('generate.organization.name')}</Label>
                    <Input
                      id="org-name"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder={t('generate.organization.namePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('generate.organization.logo')}</Label>
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <div className="relative">
                          <img src={logoUrl} alt={t('accessibility.logoPreview')} className="w-12 h-12 object-contain border rounded" />
                          <button
                            onClick={() => setLogoUrl(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                            aria-label={t('accessibility.removeLogo')}
                          >
                            <X className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 border-2 border-dashed rounded flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                        </div>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-1" aria-hidden="true" />
                        {t('generate.organization.uploadLogo')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Course Name */}
                <div className="space-y-2">
                  <Label htmlFor="course-name" required>{t('batch.settings.courseName')}</Label>
                  <Input
                    id="course-name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder={t('batch.settings.courseNamePlaceholder')}
                    aria-required="true"
                  />
                </div>

                {/* Other Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-type">{t('batch.settings.type')}</Label>
                    <Select
                      id="cert-type"
                      value={certificateType}
                      onChange={(e) => setCertificateType(e.target.value as 'participation' | 'completion')}
                    >
                      <option value="participation">{t('generate.course.typeParticipation')}</option>
                      <option value="completion">{t('generate.course.typeCompletion')}</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">{t('batch.settings.issueDate')}</Label>
                    <Input
                      id="issue-date"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-hours">{t('generate.course.hours')}</Label>
                    <Input
                      id="default-hours"
                      type="number"
                      value={defaultHours || ''}
                      onChange={(e) => setDefaultHours(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder={t('generate.course.hoursPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">{t('batch.settings.instructor')}</Label>
                    <Input
                      id="instructor"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      placeholder={t('batch.settings.instructorPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paper-size">{t('generate.preview.paperSize')}</Label>
                    <Select
                      id="paper-size"
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                    >
                      {Object.entries(PAPER_SIZES).map(([key, config]) => (
                        <option key={key} value={key}>{config.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label>{t('batch.settings.template')}</Label>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label={t('batch.settings.template')}>
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplate(template.id)}
                        role="radio"
                        aria-checked={selectedTemplate === template.id}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl" aria-hidden="true">
                          {template.id === 'elegant' && '🎨'}
                          {template.id === 'minimal' && '✨'}
                          {template.id === 'corporate' && '🏢'}
                        </span>
                        <p className="text-sm mt-1 text-gray-900 dark:text-white">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={generateCertificates}
                disabled={csvData.length === 0 || !courseName || isGenerating}
                size="lg"
                className="flex-1 min-w-[200px]"
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    {t('batch.progress.generating')} ({progress.current}/{progress.total})
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('batch.actions.generate', { count: csvData.length })}
                  </>
                )}
              </Button>

              {generatedCertificates.length > 0 && (
                <>
                  <Button
                    onClick={downloadAllAsPDF}
                    disabled={isGenerating || isSendingEmails}
                    variant="outline"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('batch.actions.downloadAll')}
                  </Button>
                  <Button
                    onClick={sendAllEmails}
                    disabled={isGenerating || isSendingEmails}
                    variant="outline"
                    size="lg"
                    aria-busy={isSendingEmails}
                  >
                    {isSendingEmails ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        {t('generate.actions.sending')} ({progress.current}/{progress.total})
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('batch.actions.sendEmails')}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Results */}
            {(generatedCertificates.length > 0 || errors.length > 0 || emailsSent > 0 || emailErrors.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('batch.progress.complete')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedCertificates.length > 0 && (
                    <Alert variant="success" role="status">
                      <AlertTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        {t('batch.progress.success', { count: generatedCertificates.length })}
                      </AlertTitle>
                      <AlertDescription>
                        {isPersisted ? (
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            {t('generate.success.persisted')}
                          </p>
                        ) : (
                          <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-1">
                            <Info className="h-4 w-4" aria-hidden="true" />
                            {t('generate.success.anonymous')}
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {errors.length > 0 && (
                    <Alert variant="error" role="alert">
                      <AlertTitle className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {t('batch.progress.errors', { count: errors.length })}
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside mt-2 text-sm">
                          {errors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {errors.length > 5 && <li>... +{errors.length - 5}</li>}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {emailsSent > 0 && (
                    <Alert variant="success" role="status">
                      <AlertTitle className="flex items-center gap-2">
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {emailsSent} {t('generate.actions.sent')}
                      </AlertTitle>
                    </Alert>
                  )}

                  {emailErrors.length > 0 && (
                    <Alert variant="error" role="alert">
                      <AlertTitle className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {emailErrors.length} {t('batch.progress.errors', { count: emailErrors.length })}
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside mt-2 text-sm">
                          {emailErrors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {emailErrors.length > 5 && <li>... +{emailErrors.length - 5}</li>}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('generate.preview.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                  <CertificatePreview
                    data={{
                      student_name: csvData[0]?.student_name || t('batch.preview.name'),
                      student_email: csvData[0]?.student_email || 'email@example.com',
                      course_name: courseName || t('batch.settings.courseName'),
                      certificate_type: certificateType,
                      instructor_name: instructorName || undefined,
                      hours: csvData[0]?.hours || defaultHours,
                      grade: csvData[0]?.grade,
                      issue_date: issueDate,
                      organization_name: organizationName || undefined,
                    }}
                    template={selectedTemplate}
                    paperSize={paperSize}
                    logoUrl={logoUrl}
                    className="shadow-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  {csvData.length > 0
                    ? t('batch.preview.rows', { count: 1 })
                    : t('batch.upload.hint')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
