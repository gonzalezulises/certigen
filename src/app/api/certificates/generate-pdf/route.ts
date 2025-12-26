import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

interface CertificateData {
  certificate_number: string;
  student_name: string;
  course_name: string;
  certificate_type: string;
  issue_date: string;
  instructor_name?: string;
  hours?: number;
  grade?: number;
}

interface GeneratePDFRequest {
  data: CertificateData;
  templateId?: string;
  config?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
  };
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePDFRequest = await request.json();
    const { data, config } = body;

    if (!data.student_name || !data.course_name || !data.certificate_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate PDF using pdf-lib
    const pdfBytes = await generatePDF(data, config);

    // Return PDF as base64
    const base64 = Buffer.from(pdfBytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return NextResponse.json({
      success: true,
      pdfDataUrl: dataUrl,
      pdfBase64: base64,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Error generating PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generatePDF(
  data: CertificateData,
  config?: GeneratePDFRequest['config']
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page (A4 landscape: 841.89 x 595.28 points)
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Embed fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Colors
  const primaryColor = config?.colors?.primary ? hexToRgb(config.colors.primary) : { r: 0.12, g: 0.23, b: 0.37 };
  const accentColor = config?.colors?.accent ? hexToRgb(config.colors.accent) : { r: 0.83, g: 0.69, b: 0.22 };
  const textColor = config?.colors?.text ? hexToRgb(config.colors.text) : { r: 0.1, g: 0.1, b: 0.18 };

  const margin = 50;

  // Draw outer border
  page.drawRectangle({
    x: margin,
    y: margin,
    width: pageWidth - 2 * margin,
    height: pageHeight - 2 * margin,
    borderColor: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    borderWidth: 3,
  });

  // Draw inner border
  page.drawRectangle({
    x: margin + 10,
    y: margin + 10,
    width: pageWidth - 2 * margin - 20,
    height: pageHeight - 2 * margin - 20,
    borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
    borderWidth: 1,
  });

  // Draw corner ornaments
  const ornamentSize = 20;
  const corners = [
    { x: margin + 20, y: pageHeight - margin - 20 }, // top-left
    { x: pageWidth - margin - 20, y: pageHeight - margin - 20 }, // top-right
    { x: margin + 20, y: margin + 20 }, // bottom-left
    { x: pageWidth - margin - 20, y: margin + 20 }, // bottom-right
  ];

  corners.forEach(corner => {
    page.drawRectangle({
      x: corner.x - ornamentSize / 2,
      y: corner.y - ornamentSize / 2,
      width: ornamentSize,
      height: ornamentSize,
      borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
      borderWidth: 1,
      rotate: { angle: 45, type: 'degrees' },
    });
  });

  // Title: CERTIFICADO DE
  let currentY = pageHeight - 130;
  const titleText = 'CERTIFICADO DE';
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 28);
  page.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y: currentY,
    size: 28,
    font: helveticaBold,
    color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
  });

  // Certificate type
  currentY -= 35;
  const typeText = data.certificate_type === 'completion' ? 'COMPLETACION' : 'PARTICIPACION';
  const typeWidth = helveticaBold.widthOfTextAtSize(typeText, 24);
  page.drawText(typeText, {
    x: (pageWidth - typeWidth) / 2,
    y: currentY,
    size: 24,
    font: helveticaBold,
    color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
  });

  // "Se certifica que"
  currentY -= 50;
  const certifyText = 'Se certifica que';
  const certifyWidth = timesItalic.widthOfTextAtSize(certifyText, 14);
  page.drawText(certifyText, {
    x: (pageWidth - certifyWidth) / 2,
    y: currentY,
    size: 14,
    font: timesItalic,
    color: rgb(textColor.r, textColor.g, textColor.b),
  });

  // Student name
  currentY -= 45;
  const nameSize = 32;
  const nameWidth = timesRoman.widthOfTextAtSize(data.student_name, nameSize);
  page.drawText(data.student_name, {
    x: (pageWidth - nameWidth) / 2,
    y: currentY,
    size: nameSize,
    font: timesRoman,
    color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
  });

  // Divider line
  currentY -= 30;
  const lineWidth = 200;
  page.drawLine({
    start: { x: (pageWidth - lineWidth) / 2, y: currentY },
    end: { x: (pageWidth + lineWidth) / 2, y: currentY },
    thickness: 2,
    color: rgb(accentColor.r, accentColor.g, accentColor.b),
  });

  // Course name
  currentY -= 35;
  const courseSize = 16;
  const courseWidth = helveticaFont.widthOfTextAtSize(data.course_name, courseSize);
  page.drawText(data.course_name, {
    x: (pageWidth - courseWidth) / 2,
    y: currentY,
    size: courseSize,
    font: helveticaFont,
    color: rgb(textColor.r, textColor.g, textColor.b),
  });

  // Details row (date, hours, grade)
  currentY -= 40;
  const detailsText: string[] = [];

  // Format date
  const issueDate = new Date(data.issue_date);
  const formattedDate = issueDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  detailsText.push(formattedDate);

  if (data.hours) {
    detailsText.push(`${data.hours} horas`);
  }
  if (data.grade) {
    detailsText.push(`${data.grade}%`);
  }

  const detailsString = detailsText.join('     •     ');
  const detailsWidth = helveticaFont.widthOfTextAtSize(detailsString, 11);
  page.drawText(detailsString, {
    x: (pageWidth - detailsWidth) / 2,
    y: currentY,
    size: 11,
    font: helveticaFont,
    color: rgb(textColor.r, textColor.g, textColor.b),
  });

  // Instructor signature
  if (data.instructor_name) {
    currentY -= 50;
    const sigLineWidth = 150;
    page.drawLine({
      start: { x: (pageWidth - sigLineWidth) / 2, y: currentY },
      end: { x: (pageWidth + sigLineWidth) / 2, y: currentY },
      thickness: 1,
      color: rgb(textColor.r, textColor.g, textColor.b),
    });

    currentY -= 15;
    const instructorWidth = helveticaFont.widthOfTextAtSize(data.instructor_name, 11);
    page.drawText(data.instructor_name, {
      x: (pageWidth - instructorWidth) / 2,
      y: currentY,
      size: 11,
      font: helveticaFont,
      color: rgb(textColor.r, textColor.g, textColor.b),
    });
  }

  // Certificate number (bottom left)
  const certNumText = `N° ${data.certificate_number}`;
  page.drawText(certNumText, {
    x: margin + 30,
    y: margin + 30,
    size: 9,
    font: helveticaFont,
    color: rgb(textColor.r, textColor.g, textColor.b),
  });

  // Generate QR code and embed it
  try {
    const validationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/validate/${data.certificate_number}`;
    const qrDataUrl = await QRCode.toDataURL(validationUrl, {
      width: 100,
      margin: 1,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    });

    // Convert data URL to bytes
    const qrBase64 = qrDataUrl.split(',')[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));
    const qrImage = await pdfDoc.embedPng(qrBytes);

    // Draw QR code (bottom right)
    const qrSize = 60;
    page.drawImage(qrImage, {
      x: pageWidth - margin - qrSize - 20,
      y: margin + 20,
      width: qrSize,
      height: qrSize,
    });

    // QR label
    const qrLabel = 'Escanea para verificar';
    const qrLabelWidth = helveticaFont.widthOfTextAtSize(qrLabel, 7);
    page.drawText(qrLabel, {
      x: pageWidth - margin - qrSize / 2 - qrLabelWidth / 2 - 20,
      y: margin + 10,
      size: 7,
      font: helveticaFont,
      color: rgb(textColor.r, textColor.g, textColor.b),
    });
  } catch (qrError) {
    console.error('QR code generation failed:', qrError);
    // Continue without QR code
  }

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
