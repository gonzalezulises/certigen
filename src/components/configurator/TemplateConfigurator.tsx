'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  TemplateConfig,
  TemplateId,
  CertificateData,
} from '@/lib/pdf/config/schema';
import { templateDefinitions, getDefaultConfig } from '@/lib/pdf/config/defaults';
import { generateQRDataURL } from '@/lib/pdf/utils/qr-generator';
import {
  ColorsPanel,
  TypographyPanel,
  LayoutPanel,
  ElementsPanel,
  ContentPanel,
  BrandingPanel,
} from './panels';
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, Button } from '@/components/ui';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  FileText,
  Building2,
  Save,
  RotateCcw,
  Download,
  Loader2,
} from 'lucide-react';

interface TemplateConfiguratorProps {
  onSave?: (templateId: TemplateId, config: TemplateConfig) => void;
  onGenerate?: (templateId: TemplateId, config: TemplateConfig, data: CertificateData) => void;
  initialTemplateId?: TemplateId;
  initialConfig?: Partial<TemplateConfig>;
  certificateData?: CertificateData;
  isGenerating?: boolean;
}

// Datos de ejemplo para preview
const defaultSampleData: CertificateData = {
  certificate_number: 'CER-20241225-123456',
  student_name: 'María García López',
  student_email: 'maria@ejemplo.com',
  course_name: 'Desarrollo Full Stack con React y Node.js',
  certificate_type: 'completion',
  issue_date: new Date().toISOString(),
  instructor_name: 'Dr. Carlos Rodríguez',
  hours: 120,
  grade: 95,
};

export function TemplateConfigurator({
  onSave,
  onGenerate,
  initialTemplateId = 'classic',
  initialConfig,
  certificateData,
  isGenerating = false,
}: TemplateConfiguratorProps) {
  const t = useTranslations('configurator');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(initialTemplateId);
  const [config, setConfig] = useState<TemplateConfig>(() => {
    const baseConfig = getDefaultConfig(initialTemplateId);
    if (initialConfig) {
      return {
        ...baseConfig,
        colors: { ...baseConfig.colors, ...initialConfig.colors },
        typography: { ...baseConfig.typography, ...initialConfig.typography },
        border: { ...baseConfig.border, ...initialConfig.border },
        ornaments: { ...baseConfig.ornaments, ...initialConfig.ornaments },
        layout: { ...baseConfig.layout, ...initialConfig.layout },
        content: { ...baseConfig.content, ...initialConfig.content },
        branding: { ...baseConfig.branding, ...initialConfig.branding },
      };
    }
    return baseConfig;
  });
  const [activePanel, setActivePanel] = useState('colors');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const sampleData = certificateData || defaultSampleData;

  // Generar QR
  useEffect(() => {
    const generateQR = async () => {
      if (config.content.showQR) {
        const url = await generateQRDataURL(
          `https://example.com/validate/${sampleData.certificate_number}`,
          {
            color: {
              dark: config.colors.text,
              light: config.colors.background,
            },
          }
        );
        setQrDataUrl(url);
      }
    };
    generateQR();
  }, [config.colors.text, config.colors.background, config.content.showQR, sampleData.certificate_number]);

  // Actualizar config
  const updateConfig = useCallback(<K extends keyof TemplateConfig>(
    section: K,
    updates: Partial<TemplateConfig[K]>
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  }, []);

  // Cambiar plantilla
  const handleTemplateChange = useCallback((templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setConfig(getDefaultConfig(templateId));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setConfig(getDefaultConfig(selectedTemplate));
  }, [selectedTemplate]);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
      {/* Panel izquierdo */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 overflow-hidden">
        {/* Selector de plantilla */}
        <Card className="p-4">
          <h3 className="font-medium mb-3 text-gray-900 dark:text-white">{t('templates.title')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(templateDefinitions) as TemplateId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleTemplateChange(id)}
                className={`
                  relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all
                  ${selectedTemplate === id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className={`
                  w-full h-full flex items-center justify-center text-sm font-medium
                  ${id === 'classic' ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : ''}
                  ${id === 'minimal' ? 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : ''}
                  ${id === 'creative' ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300' : ''}
                `}>
                  {t(`templates.${id}.name`)}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t(`templates.${selectedTemplate}.description`)}
          </p>
        </Card>

        {/* Paneles de configuración */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activePanel}
            onValueChange={setActivePanel}
            className="flex flex-col h-full"
          >
            <TabsList className="grid grid-cols-6 m-2">
              <TabsTrigger value="colors" title={t('panels.colors')}>
                <Palette className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="typography" title={t('panels.typography')}>
                <Type className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="layout" title={t('panels.layout')}>
                <Layout className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="elements" title={t('panels.elements')}>
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="content" title={t('panels.content')}>
                <FileText className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="branding" title={t('panels.branding')}>
                <Building2 className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="colors">
                <ColorsPanel
                  config={config.colors}
                  onChange={(updates) => updateConfig('colors', updates)}
                />
              </TabsContent>

              <TabsContent value="typography">
                <TypographyPanel
                  config={config.typography}
                  onChange={(updates) => updateConfig('typography', updates)}
                />
              </TabsContent>

              <TabsContent value="layout">
                <LayoutPanel
                  config={config.layout}
                  borderConfig={config.border}
                  onLayoutChange={(updates) => updateConfig('layout', updates)}
                  onBorderChange={(updates) => updateConfig('border', updates)}
                />
              </TabsContent>

              <TabsContent value="elements">
                <ElementsPanel
                  config={config.ornaments}
                  onChange={(updates) => updateConfig('ornaments', updates)}
                />
              </TabsContent>

              <TabsContent value="content">
                <ContentPanel
                  config={config.content}
                  onChange={(updates) => updateConfig('content', updates)}
                />
              </TabsContent>

              <TabsContent value="branding">
                <BrandingPanel
                  config={config.branding}
                  onChange={(updates) => updateConfig('branding', updates)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </Button>
          <Button
            onClick={() => onSave?.(selectedTemplate, config)}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            {t('saveConfig')}
          </Button>
        </div>
      </div>

      {/* Panel derecho: Preview */}
      <div className="col-span-12 lg:col-span-7">
        <Card className="h-full overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('preview')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => onGenerate?.(selectedTemplate, config, sampleData)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {t('downloadPdf')}
            </Button>
          </div>
          <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 overflow-auto">
            {/* Certificate Preview */}
            <div
              className="mx-auto shadow-lg overflow-hidden relative"
              style={{
                backgroundColor: config.colors?.background ?? '#ffffff',
                aspectRatio: config.layout?.orientation === 'landscape' ? '1.414' : '0.707',
                maxWidth: config.layout?.orientation === 'landscape' ? '100%' : '70%',
                padding: config.border?.padding === 'compact' ? '24px' : config.border?.padding === 'spacious' ? '48px' : '36px',
                border: config.border?.style !== 'none'
                  ? `${config.border?.width === 'thin' ? '1px' : config.border?.width === 'thick' ? '4px' : '2px'} solid ${config.colors?.border ?? '#1a365d'}`
                  : 'none',
                borderRadius: config.border?.radius === 'large' ? '16px' : config.border?.radius === 'medium' ? '8px' : config.border?.radius === 'small' ? '4px' : '0',
              }}
            >
              {/* Corner Ornaments */}
              {config.border?.cornerStyle && config.border.cornerStyle !== 'none' && (
                <>
                  <div style={{ position: 'absolute', top: 8, left: 8, color: config.colors?.border ?? '#1a365d', fontSize: config.border.cornerStyle === 'simple' ? '16px' : '24px' }}>
                    {config.border.cornerStyle === 'flourish' ? '❧' : config.border.cornerStyle === 'ornate' ? '◆' : '┌'}
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, color: config.colors?.border ?? '#1a365d', fontSize: config.border.cornerStyle === 'simple' ? '16px' : '24px', transform: 'scaleX(-1)' }}>
                    {config.border.cornerStyle === 'flourish' ? '❧' : config.border.cornerStyle === 'ornate' ? '◆' : '┐'}
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, left: 8, color: config.colors?.border ?? '#1a365d', fontSize: config.border.cornerStyle === 'simple' ? '16px' : '24px', transform: 'scaleY(-1)' }}>
                    {config.border.cornerStyle === 'flourish' ? '❧' : config.border.cornerStyle === 'ornate' ? '◆' : '└'}
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, right: 8, color: config.colors?.border ?? '#1a365d', fontSize: config.border.cornerStyle === 'simple' ? '16px' : '24px', transform: 'scale(-1)' }}>
                    {config.border.cornerStyle === 'flourish' ? '❧' : config.border.cornerStyle === 'ornate' ? '◆' : '┘'}
                  </div>
                </>
              )}

              <div className="h-full flex flex-col items-center justify-between text-center relative">
                {/* Header */}
                <div className="w-full">
                  {config.branding?.logoUrl && (
                    <div className="mb-2 flex justify-center">
                      <img
                        src={config.branding.logoUrl}
                        alt="Logo"
                        style={{
                          height: config.layout?.logoSize === 'small' ? '40px' : config.layout?.logoSize === 'large' ? '80px' : '60px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}
                  {config.content?.showOrganizationName && config.branding?.organizationName && (
                    <p
                      style={{
                        color: config.colors?.text ?? '#1a202c',
                        fontFamily: config.typography?.bodyFont === 'serif' ? 'Georgia, serif' : config.typography?.bodyFont === 'script' ? 'cursive' : 'system-ui, sans-serif',
                      }}
                      className="text-sm font-medium mb-2"
                    >
                      {config.branding.organizationName}
                    </p>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <h2
                    style={{
                      color: config.colors?.primary ?? '#1a365d',
                      textTransform: config.typography?.titleTransform ?? 'none',
                      letterSpacing: config.typography?.titleTransform === 'uppercase' ? '3px' : '0',
                      fontFamily: config.typography?.titleFont === 'serif' ? 'Georgia, serif' : config.typography?.titleFont === 'script' ? 'cursive' : config.typography?.titleFont === 'display' ? 'cursive' : 'system-ui, sans-serif',
                      fontWeight: config.typography?.titleWeight === 'bold' ? 700 : config.typography?.titleWeight === 'medium' ? 500 : 400,
                      fontSize: config.typography?.scale === 'compact' ? '1.25rem' : config.typography?.scale === 'spacious' ? '1.75rem' : '1.5rem',
                    }}
                    className="mb-3"
                  >
                    {config.content?.headerText ?? 'Certificado'}
                  </h2>
                  {config.content?.showSubtitle && config.content?.subtitleTemplate && (
                    <p
                      style={{
                        color: config.colors?.textMuted ?? '#6b7280',
                        fontFamily: config.typography?.bodyFont === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                      }}
                      className="text-sm mb-3"
                    >
                      {config.content.subtitleTemplate}
                    </p>
                  )}
                  <h3
                    style={{
                      color: config.colors?.text ?? '#1a202c',
                      fontFamily: config.typography?.accentFont === 'script' ? 'cursive' : config.typography?.accentFont === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                      fontWeight: config.typography?.nameWeight === 'black' ? 900 : config.typography?.nameWeight === 'bold' ? 700 : config.typography?.nameWeight === 'medium' ? 500 : 400,
                      fontSize: config.typography?.scale === 'compact' ? '1.5rem' : config.typography?.scale === 'spacious' ? '2.25rem' : '1.875rem',
                    }}
                    className="mb-3"
                  >
                    {sampleData.student_name}
                  </h3>

                  {/* Divider */}
                  <div className="my-3 flex items-center justify-center" style={{ width: '150px' }}>
                    {config.ornaments?.dividerStyle === 'none' ? null :
                     config.ornaments?.dividerStyle === 'dots' ? (
                      <div className="flex gap-1 items-center">
                        <span style={{ color: config.colors?.accent ?? '#c9a227', fontSize: '8px' }}>●</span>
                        <span style={{ color: config.colors?.accent ?? '#c9a227', fontSize: '10px' }}>●</span>
                        <span style={{ color: config.colors?.accent ?? '#c9a227', fontSize: '12px' }}>●</span>
                        <span style={{ color: config.colors?.accent ?? '#c9a227', fontSize: '10px' }}>●</span>
                        <span style={{ color: config.colors?.accent ?? '#c9a227', fontSize: '8px' }}>●</span>
                      </div>
                    ) : config.ornaments?.dividerStyle === 'ornate' ? (
                      <div className="flex items-center gap-2">
                        <div style={{ width: '40px', height: '1px', backgroundColor: config.colors?.accent ?? '#c9a227' }} />
                        <span style={{ color: config.colors?.accent ?? '#c9a227' }}>◆</span>
                        <div style={{ width: '40px', height: '1px', backgroundColor: config.colors?.accent ?? '#c9a227' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100px', height: '2px', backgroundColor: config.colors?.accent ?? '#c9a227' }} />
                    )}
                  </div>

                  <p
                    style={{
                      color: config.colors?.secondary ?? '#2d3748',
                      fontFamily: config.typography?.bodyFont === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                      fontSize: config.typography?.scale === 'compact' ? '0.875rem' : config.typography?.scale === 'spacious' ? '1.125rem' : '1rem',
                    }}
                    className="mb-4 max-w-[80%]"
                  >
                    {sampleData.course_name}
                  </p>

                  <div
                    className="flex gap-6 text-sm"
                    style={{
                      color: config.colors?.textMuted ?? '#6b7280',
                      fontFamily: config.typography?.bodyFont === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                    }}
                  >
                    {config.content?.showDate && <span>📅 {new Date().toLocaleDateString()}</span>}
                    {config.content?.showHours && sampleData.hours && <span>⏱ {sampleData.hours} horas</span>}
                    {config.content?.showGrade && sampleData.grade && <span>📊 {sampleData.grade}%</span>}
                  </div>

                  {/* Instructor / Signature */}
                  {config.content?.showInstructor && sampleData.instructor_name && (
                    <div className="mt-6 text-center">
                      {config.layout?.showSignatureLine && (
                        <div
                          style={{
                            width: '120px',
                            height: '1px',
                            backgroundColor: config.colors?.border ?? '#1a365d',
                            margin: '0 auto 8px'
                          }}
                        />
                      )}
                      <p style={{ color: config.colors?.text ?? '#1a202c', fontSize: '0.75rem' }}>
                        {sampleData.instructor_name}
                      </p>
                      {config.branding?.signatureLabel && (
                        <p style={{ color: config.colors?.textMuted ?? '#6b7280', fontSize: '0.625rem' }}>
                          {config.branding.signatureLabel}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Seal */}
                  {config.ornaments?.showSeal && (
                    <div
                      className="absolute"
                      style={{
                        bottom: config.ornaments?.sealPosition === 'bottom-center' ? '60px' : '40px',
                        right: config.ornaments?.sealPosition === 'bottom-right' ? '40px' : config.ornaments?.sealPosition === 'top-right' ? '40px' : 'auto',
                        top: config.ornaments?.sealPosition === 'top-right' ? '40px' : 'auto',
                        left: config.ornaments?.sealPosition === 'bottom-center' ? '50%' : 'auto',
                        transform: config.ornaments?.sealPosition === 'bottom-center' ? 'translateX(-50%)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: config.ornaments?.sealStyle === 'badge' ? '8px' : '50%',
                          backgroundColor: config.colors?.primary ?? '#1a365d',
                          border: `2px solid ${config.colors?.accent ?? '#c9a227'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: config.colors?.accent ?? '#c9a227',
                          fontSize: '20px',
                        }}
                      >
                        ★
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between items-end mt-4">
                  <div>
                    {config.content?.showCertificateNumber && (
                      <p
                        style={{
                          color: config.colors?.textMuted ?? '#6b7280',
                          fontFamily: 'monospace',
                        }}
                        className="text-xs"
                      >
                        N° {sampleData.certificate_number}
                      </p>
                    )}
                  </div>
                  <div>
                    {config.content?.showQR && qrDataUrl && (
                      <div className="text-center">
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          style={{
                            width: config.layout?.qrSize === 'small' ? '40px' : config.layout?.qrSize === 'large' ? '70px' : '55px',
                            height: config.layout?.qrSize === 'small' ? '40px' : config.layout?.qrSize === 'large' ? '70px' : '55px',
                            backgroundColor: config.colors?.background ?? '#ffffff',
                            padding: '2px',
                            borderRadius: '4px'
                          }}
                        />
                        <p style={{ color: config.colors?.textMuted ?? '#6b7280', fontSize: '6px', marginTop: '2px' }}>
                          Escanea para verificar
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default TemplateConfigurator;
