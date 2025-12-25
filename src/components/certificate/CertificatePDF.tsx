'use client';

import React, { useCallback, useState } from 'react';
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

export function useCertificatePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = useCallback(async (
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

      // Get paper dimensions
      const paper = PAPER_SIZES[paperSize];

      // Clone the element for rendering
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = `${paper.width * 4}px`; // 4x for high resolution
      clone.style.height = `${paper.height * 4}px`;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '-9999px';
      document.body.appendChild(clone);

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create canvas from element with high quality settings
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        width: paper.width * 4,
        height: paper.height * 4,
      });

      // Remove clone
      document.body.removeChild(clone);

      // Create PDF with correct paper size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: paperSize === 'legal' ? 'legal' : 'a4',
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

      // Get blob
      const blob = pdf.output('blob');

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el PDF';
      console.error('Error generating PDF:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generatePDF, isGenerating, error };
}

export function CertificatePDFButton({
  elementId,
  fileName = 'certificado.pdf',
  paperSize = 'a4',
  onGenerated,
  onError,
}: CertificatePDFProps) {
  const { generatePDF, isGenerating, error } = useCertificatePDF();

  const handleClick = async () => {
    const blob = await generatePDF(elementId, fileName, paperSize);
    if (blob && onGenerated) {
      onGenerated(blob);
    }
    if (!blob && onError && error) {
      onError(error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      className="gap-2"
      size="lg"
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

export async function GeneratePDFBlob(
  elementId: string,
  paperSize: PaperSize = 'a4'
): Promise<Blob | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      return null;
    }

    const paper = PAPER_SIZES[paperSize];

    // Clone for high-res rendering
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = `${paper.width * 4}px`;
    clone.style.height = `${paper.height * 4}px`;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
      width: paper.width * 4,
      height: paper.height * 4,
    });

    document.body.removeChild(clone);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: paperSize === 'legal' ? 'legal' : 'a4',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, paper.width, paper.height);

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return null;
  }
}
