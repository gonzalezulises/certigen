'use client';

import React, { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface CertificatePDFProps {
  elementId: string;
  fileName?: string;
  onGenerated?: (blob: Blob) => void;
}

export function useCertificatePDF() {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = useCallback(async (
    elementId: string,
    fileName: string = 'certificado.pdf'
  ): Promise<Blob | null> => {
    setIsGenerating(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Certificate element not found');
      }

      // Create canvas from element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      // Calculate dimensions for A4 landscape
      const imgWidth = 297; // A4 width in mm (landscape)
      const imgHeight = 210; // A4 height in mm (landscape)

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Get blob
      const blob = pdf.output('blob');

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generatePDF, isGenerating };
}

export function CertificatePDFButton({
  elementId,
  fileName = 'certificado.pdf',
  onGenerated,
}: CertificatePDFProps) {
  const { generatePDF, isGenerating } = useCertificatePDF();

  const handleClick = async () => {
    const blob = await generatePDF(elementId, fileName);
    if (blob && onGenerated) {
      onGenerated(blob);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando...
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

export function GeneratePDFBlob(elementId: string): Promise<Blob | null> {
  return new Promise(async (resolve) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve(null);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

      resolve(pdf.output('blob'));
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      resolve(null);
    }
  });
}
