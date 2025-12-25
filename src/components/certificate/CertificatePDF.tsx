'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { PaperSize, PAPER_SIZES } from '@/types/certificate';

interface CertificatePDFProps {
  elementId: string;
  fileName?: string;
  paperSize?: PaperSize;
  onGenerated?: (blob: Blob) => void;
  onError?: (error: string) => void;
}

export function CertificatePDFButton({
  elementId,
  fileName = 'certificado.pdf',
  paperSize = 'a4',
  onGenerated,
  onError,
}: CertificatePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('No se encontro el elemento del certificado');
      }

      const paper = PAPER_SIZES[paperSize];

      // Store original styles
      const originalStyle = element.getAttribute('style') || '';

      // Set fixed dimensions for rendering
      const renderWidth = 1200;
      const renderHeight = Math.round(renderWidth / paper.aspectRatio);

      element.style.width = `${renderWidth}px`;
      element.style.height = `${renderHeight}px`;
      element.style.maxWidth = 'none';

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 50));

      // Create canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: renderWidth,
        height: renderHeight,
      });

      // Restore original styles
      element.setAttribute('style', originalStyle);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: paperSize === 'legal' ? [355.6, 215.9] : 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

      // Download
      pdf.save(fileName);

      if (onGenerated) {
        onGenerated(pdf.output('blob'));
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el PDF';
      if (onError) {
        onError(errorMessage);
      }
      alert('Error al generar el PDF: ' + errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className="gap-2"
      size="lg"
      type="button"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Descargar PDF
        </>
      )}
    </Button>
  );
}

// Hook for programmatic usage
export function useCertificatePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (
    elementId: string,
    fileName: string = 'certificado.pdf',
    paperSize: PaperSize = 'a4'
  ): Promise<Blob | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('No se encontro el elemento del certificado');
      }

      const paper = PAPER_SIZES[paperSize];
      const originalStyle = element.getAttribute('style') || '';

      const renderWidth = 1200;
      const renderHeight = Math.round(renderWidth / paper.aspectRatio);

      element.style.width = `${renderWidth}px`;
      element.style.height = `${renderHeight}px`;
      element.style.maxWidth = 'none';

      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: renderWidth,
        height: renderHeight,
      });

      element.setAttribute('style', originalStyle);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: paperSize === 'legal' ? [355.6, 215.9] : 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

      pdf.save(fileName);
      return pdf.output('blob');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el PDF';
      console.error('Error generating PDF:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating, error };
}
