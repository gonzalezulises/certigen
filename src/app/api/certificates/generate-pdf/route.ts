import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts, degrees, PDFPage, PDFFont } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateRatelimit, getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

// ============================================
// INTERFACES
// ============================================

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

interface ColorConfig {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  textMuted?: string;
  border?: string;
}

interface ContentConfig {
  headerText?: string;
  subtitleTemplate?: string;
  footerText?: string;
  showSubtitle?: boolean;
  showHours?: boolean;
  showGrade?: boolean;
  showDate?: boolean;
  showInstructor?: boolean;
  showCertificateNumber?: boolean;
  showQR?: boolean;
  showOrganizationName?: boolean;
}

interface LayoutConfig {
  orientation?: 'landscape' | 'portrait';
  paperSize?: 'A4' | 'LETTER' | 'LEGAL';
  qrPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';
  qrSize?: 'small' | 'medium' | 'large';
  signaturePosition?: 'left' | 'center' | 'right' | 'dual';
  showSignatureLine?: boolean;
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  logoSize?: 'small' | 'medium' | 'large';
}

interface BorderConfig {
  style?: 'none' | 'simple' | 'double' | 'certificate' | 'ornate' | 'geometric' | 'gradient';
  width?: 'thin' | 'medium' | 'thick';
  cornerStyle?: 'none' | 'simple' | 'ornate' | 'flourish';
  padding?: 'compact' | 'normal' | 'spacious';
  radius?: 'none' | 'small' | 'medium' | 'large';
}

interface OrnamentConfig {
  dividerStyle?: 'none' | 'simple' | 'ornate' | 'dots' | 'gradient';
}

interface BrandingConfig {
  logoUrl?: string;
  signatureImage?: string;
  signatureLabel?: string;
  secondSignatureImage?: string;
  secondSignatureLabel?: string;
  organizationName?: string;
  organizationSubtitle?: string;
}

interface PDFConfig {
  colors?: ColorConfig;
  content?: ContentConfig;
  layout?: LayoutConfig;
  border?: BorderConfig;
  ornaments?: OrnamentConfig;
  branding?: BrandingConfig;
}

interface GeneratePDFRequest {
  data: CertificateData;
  templateId?: string;
  config?: PDFConfig;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// ============================================
// CONSTANTS
// ============================================

const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
};

const BORDER_WIDTHS = { thin: 1, medium: 2, thick: 4 };
const QR_SIZES = { small: 80, medium: 120, large: 160 };
const LOGO_SIZES = { small: 60, medium: 80, large: 100 };
const PADDINGS = { compact: 30, normal: 50, spacious: 70 };

const DEFAULT_COLORS = {
  primary: { r: 0.10, g: 0.21, b: 0.36 },
  secondary: { r: 0.17, g: 0.32, b: 0.51 },
  accent: { r: 0.79, g: 0.64, b: 0.15 },
  background: { r: 1, g: 1, b: 1 },
  text: { r: 0.10, g: 0.13, b: 0.17 },
  textMuted: { r: 0.29, g: 0.33, b: 0.42 },
  border: { r: 0.10, g: 0.21, b: 0.36 },
};

// ============================================
// HELPERS
// ============================================

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

function getColor(config: ColorConfig | undefined, key: keyof typeof DEFAULT_COLORS): RGB {
  const colorValue = config?.[key as keyof ColorConfig];
  if (colorValue) return hexToRgb(colorValue);
  return DEFAULT_COLORS[key];
}

function getPageDimensions(layout?: LayoutConfig): { width: number; height: number } {
  const paperSize = layout?.paperSize || 'A4';
  const orientation = layout?.orientation || 'landscape';
  const size = PAGE_SIZES[paperSize];

  if (orientation === 'landscape') {
    return { width: size.height, height: size.width };
  }
  return size;
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawBackground(
  page: PDFPage,
  pageWidth: number,
  pageHeight: number,
  colors: { background: RGB }
) {
  if (colors.background.r !== 1 || colors.background.g !== 1 || colors.background.b !== 1) {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(colors.background.r, colors.background.g, colors.background.b),
    });
  }
}

function drawBorder(
  page: PDFPage,
  pageWidth: number,
  pageHeight: number,
  border: BorderConfig | undefined,
  colors: { primary: RGB; accent: RGB; border: RGB }
) {
  const style = border?.style || 'certificate';
  const width = BORDER_WIDTHS[border?.width || 'medium'];
  const padding = PADDINGS[border?.padding || 'normal'];
  const cornerStyle = border?.cornerStyle || 'simple';

  if (style === 'none') return padding;

  const borderColor = colors.border;
  const accentColor = colors.accent;

  // Outer border - applies to all styles except 'none'
  page.drawRectangle({
    x: padding,
    y: padding,
    width: pageWidth - 2 * padding,
    height: pageHeight - 2 * padding,
    borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
    borderWidth: width,
  });

  // Inner border for double/certificate/ornate/geometric
  if (style === 'double' || style === 'certificate' || style === 'ornate' || style === 'geometric') {
    const innerOffset = style === 'ornate' ? 15 : style === 'geometric' ? 12 : 10;
    page.drawRectangle({
      x: padding + innerOffset,
      y: padding + innerOffset,
      width: pageWidth - 2 * padding - 2 * innerOffset,
      height: pageHeight - 2 * padding - 2 * innerOffset,
      borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
      borderWidth: 1,
    });
  }

  // Additional decorations for geometric style
  if (style === 'geometric') {
    // Draw corner squares
    const squareSize = 20;
    const corners = [
      { x: padding, y: pageHeight - padding - squareSize },
      { x: pageWidth - padding - squareSize, y: pageHeight - padding - squareSize },
      { x: padding, y: padding },
      { x: pageWidth - padding - squareSize, y: padding },
    ];
    corners.forEach(corner => {
      page.drawRectangle({
        x: corner.x,
        y: corner.y,
        width: squareSize,
        height: squareSize,
        borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
        borderWidth: 1,
      });
    });
  }

  // Gradient style - multiple nested rectangles with decreasing opacity
  if (style === 'gradient') {
    for (let i = 1; i <= 3; i++) {
      const offset = padding + i * 5;
      const opacity = 1 - i * 0.25;
      page.drawRectangle({
        x: offset,
        y: offset,
        width: pageWidth - 2 * offset,
        height: pageHeight - 2 * offset,
        borderColor: rgb(borderColor.r * opacity, borderColor.g * opacity, borderColor.b * opacity),
        borderWidth: 1,
      });
    }
  }

  // Corner ornaments
  if (cornerStyle !== 'none') {
    const ornamentSize = cornerStyle === 'flourish' ? 25 : cornerStyle === 'ornate' ? 20 : 15;
    const corners = [
      { x: padding + 20, y: pageHeight - padding - 20 },
      { x: pageWidth - padding - 20, y: pageHeight - padding - 20 },
      { x: padding + 20, y: padding + 20 },
      { x: pageWidth - padding - 20, y: padding + 20 },
    ];

    corners.forEach(corner => {
      if (cornerStyle === 'simple') {
        page.drawRectangle({
          x: corner.x - ornamentSize / 2,
          y: corner.y - ornamentSize / 2,
          width: ornamentSize,
          height: ornamentSize,
          borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
          borderWidth: 1,
          rotate: degrees(45),
        });
      } else if (cornerStyle === 'ornate' || cornerStyle === 'flourish') {
        // Double diamond for ornate/flourish
        page.drawRectangle({
          x: corner.x - ornamentSize / 2,
          y: corner.y - ornamentSize / 2,
          width: ornamentSize,
          height: ornamentSize,
          borderColor: rgb(accentColor.r, accentColor.g, accentColor.b),
          borderWidth: 1,
          rotate: degrees(45),
        });
        page.drawRectangle({
          x: corner.x - ornamentSize / 3,
          y: corner.y - ornamentSize / 3,
          width: ornamentSize * 0.66,
          height: ornamentSize * 0.66,
          borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
          borderWidth: 1,
          rotate: degrees(45),
        });
      }
    });
  }

  return padding;
}

function drawDivider(
  page: PDFPage,
  pageWidth: number,
  y: number,
  style: string,
  colors: { accent: RGB }
) {
  const lineWidth = 200;
  const centerX = pageWidth / 2;

  if (style === 'none') return;

  if (style === 'simple') {
    page.drawLine({
      start: { x: centerX - lineWidth / 2, y },
      end: { x: centerX + lineWidth / 2, y },
      thickness: 2,
      color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
    });
  } else if (style === 'ornate') {
    // Three lines with dots
    page.drawLine({
      start: { x: centerX - lineWidth / 2, y },
      end: { x: centerX - 20, y },
      thickness: 1,
      color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
    });
    page.drawLine({
      start: { x: centerX + 20, y },
      end: { x: centerX + lineWidth / 2, y },
      thickness: 1,
      color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
    });
    // Center diamond
    page.drawRectangle({
      x: centerX - 5,
      y: y - 5,
      width: 10,
      height: 10,
      color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
      rotate: degrees(45),
    });
  } else if (style === 'dots') {
    const dotSpacing = 15;
    const numDots = Math.floor(lineWidth / dotSpacing);
    for (let i = 0; i < numDots; i++) {
      const x = centerX - lineWidth / 2 + i * dotSpacing + dotSpacing / 2;
      page.drawCircle({
        x,
        y,
        size: 2,
        color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
      });
    }
  } else {
    // Default to simple
    page.drawLine({
      start: { x: centerX - lineWidth / 2, y },
      end: { x: centerX + lineWidth / 2, y },
      thickness: 2,
      color: rgb(colors.accent.r, colors.accent.g, colors.accent.b),
    });
  }
}

async function drawQRCode(
  page: PDFPage,
  pdfDoc: PDFDocument,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  layout: LayoutConfig | undefined,
  certificateNumber: string,
  font: PDFFont,
  textColor: RGB
) {
  try {
    const validationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/validate/${certificateNumber}`;
    const qrDataUrl = await QRCode.toDataURL(validationUrl, {
      width: 150,
      margin: 1,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    });

    const qrBase64 = qrDataUrl.split(',')[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));
    const qrImage = await pdfDoc.embedPng(qrBytes);

    const qrSize = QR_SIZES[layout?.qrSize || 'medium'];
    const position = layout?.qrPosition || 'bottom-right';

    let qrX: number;
    const qrY = margin + 15;

    if (position === 'bottom-left') {
      qrX = margin + 20;
    } else if (position === 'bottom-center') {
      qrX = (pageWidth - qrSize) / 2;
    } else {
      qrX = pageWidth - margin - qrSize - 20;
    }

    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    const qrLabel = 'Escanea para verificar';
    const qrLabelWidth = font.widthOfTextAtSize(qrLabel, 7);
    page.drawText(qrLabel, {
      x: qrX + qrSize / 2 - qrLabelWidth / 2,
      y: qrY - 5,
      size: 7,
      font,
      color: rgb(textColor.r, textColor.g, textColor.b),
    });
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
}

async function embedImage(
  pdfDoc: PDFDocument,
  imageData: string
): Promise<{ image: Awaited<ReturnType<typeof pdfDoc.embedPng>>; type: 'png' | 'jpg' } | null> {
  try {
    // Handle data URL format
    let base64Data = imageData;
    let isPng = true;

    if (imageData.startsWith('data:')) {
      const match = imageData.match(/^data:image\/(png|jpe?g);base64,(.+)$/i);
      if (!match) return null;
      isPng = match[1].toLowerCase() === 'png';
      base64Data = match[2];
    }

    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    if (isPng) {
      const image = await pdfDoc.embedPng(bytes);
      return { image, type: 'png' };
    } else {
      const image = await pdfDoc.embedJpg(bytes);
      return { image, type: 'jpg' };
    }
  } catch (error) {
    console.error('Image embedding failed:', error);
    return null;
  }
}

async function drawLogo(
  page: PDFPage,
  pdfDoc: PDFDocument,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  layout: LayoutConfig | undefined,
  branding: BrandingConfig | undefined
) {
  if (!branding?.logoUrl) return;

  const embedded = await embedImage(pdfDoc, branding.logoUrl);
  if (!embedded) return;

  const { image } = embedded;
  const logoSizeValue = LOGO_SIZES[layout?.logoSize || 'medium'];

  // Calculate dimensions maintaining aspect ratio
  const aspectRatio = image.width / image.height;
  let logoWidth = logoSizeValue;
  let logoHeight = logoSizeValue / aspectRatio;

  if (logoHeight > logoSizeValue) {
    logoHeight = logoSizeValue;
    logoWidth = logoSizeValue * aspectRatio;
  }

  const position = layout?.logoPosition || 'top-center';
  let logoX: number;
  let logoY: number;

  // Calculate X position
  if (position.includes('left')) {
    logoX = margin + 20;
  } else if (position.includes('right')) {
    logoX = pageWidth - margin - logoWidth - 20;
  } else {
    logoX = (pageWidth - logoWidth) / 2;
  }

  // Calculate Y position
  if (position.includes('top')) {
    logoY = pageHeight - margin - logoHeight - 20;
  } else {
    logoY = margin + 20;
  }

  page.drawImage(image, {
    x: logoX,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
  });
}

async function drawSignatures(
  page: PDFPage,
  pdfDoc: PDFDocument,
  pageWidth: number,
  margin: number,
  currentY: number,
  layout: LayoutConfig | undefined,
  branding: BrandingConfig | undefined,
  font: PDFFont,
  textColor: RGB
): Promise<number> {
  const position = layout?.signaturePosition || 'center';
  const showLine = layout?.showSignatureLine ?? true;
  const sigLineWidth = 150;
  const sigImageHeight = 50;

  let newY = currentY;

  if (position === 'dual') {
    // Dual signatures - left and right
    const leftX = pageWidth / 4;
    const rightX = (pageWidth * 3) / 4;

    // Left signature
    if (branding?.signatureImage) {
      const embedded = await embedImage(pdfDoc, branding.signatureImage);
      if (embedded) {
        const { image } = embedded;
        const aspectRatio = image.width / image.height;
        const sigWidth = sigImageHeight * aspectRatio;
        page.drawImage(image, {
          x: leftX - sigWidth / 2,
          y: newY,
          width: sigWidth,
          height: sigImageHeight,
        });
      }
    }

    // Right signature
    if (branding?.secondSignatureImage) {
      const embedded = await embedImage(pdfDoc, branding.secondSignatureImage);
      if (embedded) {
        const { image } = embedded;
        const aspectRatio = image.width / image.height;
        const sigWidth = sigImageHeight * aspectRatio;
        page.drawImage(image, {
          x: rightX - sigWidth / 2,
          y: newY,
          width: sigWidth,
          height: sigImageHeight,
        });
      }
    }

    newY -= sigImageHeight + 10;

    // Signature lines
    if (showLine) {
      page.drawLine({
        start: { x: leftX - sigLineWidth / 2, y: newY },
        end: { x: leftX + sigLineWidth / 2, y: newY },
        thickness: 1,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      page.drawLine({
        start: { x: rightX - sigLineWidth / 2, y: newY },
        end: { x: rightX + sigLineWidth / 2, y: newY },
        thickness: 1,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
    }

    newY -= 15;

    // Signature labels
    if (branding?.signatureLabel) {
      const labelWidth = font.widthOfTextAtSize(branding.signatureLabel, 10);
      page.drawText(branding.signatureLabel, {
        x: leftX - labelWidth / 2,
        y: newY,
        size: 10,
        font,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
    }

    if (branding?.secondSignatureLabel) {
      const labelWidth = font.widthOfTextAtSize(branding.secondSignatureLabel, 10);
      page.drawText(branding.secondSignatureLabel, {
        x: rightX - labelWidth / 2,
        y: newY,
        size: 10,
        font,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
    }
  } else {
    // Single signature - left, center, or right
    let sigX: number;
    if (position === 'left') {
      sigX = pageWidth / 4;
    } else if (position === 'right') {
      sigX = (pageWidth * 3) / 4;
    } else {
      sigX = pageWidth / 2;
    }

    // Signature image
    if (branding?.signatureImage) {
      const embedded = await embedImage(pdfDoc, branding.signatureImage);
      if (embedded) {
        const { image } = embedded;
        const aspectRatio = image.width / image.height;
        const sigWidth = sigImageHeight * aspectRatio;
        page.drawImage(image, {
          x: sigX - sigWidth / 2,
          y: newY,
          width: sigWidth,
          height: sigImageHeight,
        });
        newY -= sigImageHeight + 10;
      }
    }

    // Signature line
    if (showLine) {
      page.drawLine({
        start: { x: sigX - sigLineWidth / 2, y: newY },
        end: { x: sigX + sigLineWidth / 2, y: newY },
        thickness: 1,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      newY -= 15;
    }

    // Signature label
    if (branding?.signatureLabel) {
      const labelWidth = font.widthOfTextAtSize(branding.signatureLabel, 10);
      page.drawText(branding.signatureLabel, {
        x: sigX - labelWidth / 2,
        y: newY,
        size: 10,
        font,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
    }
  }

  return newY - 20;
}

function drawOrganizationName(
  page: PDFPage,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  branding: BrandingConfig | undefined,
  content: { showOrganizationName: boolean },
  font: PDFFont,
  boldFont: PDFFont,
  colors: { primary: RGB; textMuted: RGB }
) {
  if (!content.showOrganizationName || !branding?.organizationName) return;

  const orgY = pageHeight - margin - 30;
  const orgNameWidth = boldFont.widthOfTextAtSize(branding.organizationName, 14);

  page.drawText(branding.organizationName, {
    x: (pageWidth - orgNameWidth) / 2,
    y: orgY,
    size: 14,
    font: boldFont,
    color: rgb(colors.primary.r, colors.primary.g, colors.primary.b),
  });

  if (branding.organizationSubtitle) {
    const subtitleWidth = font.widthOfTextAtSize(branding.organizationSubtitle, 10);
    page.drawText(branding.organizationSubtitle, {
      x: (pageWidth - subtitleWidth) / 2,
      y: orgY - 15,
      size: 10,
      font,
      color: rgb(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b),
    });
  }
}

// ============================================
// MAIN EXPORT
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (stricter for PDF generation: 5 req/min)
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(generateRatelimit, clientIp);
    if (rateLimitResult && !rateLimitResult.success) {
      return rateLimitExceededResponse(rateLimitResult.reset);
    }

    const body: GeneratePDFRequest = await request.json();
    const { data, config } = body;

    if (!data.student_name || !data.course_name || !data.certificate_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pdfBytes = await generatePDF(data, config);
    const base64 = Buffer.from(pdfBytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return NextResponse.json({ success: true, pdfDataUrl: dataUrl, pdfBase64: base64 });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Error generating PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generatePDF(data: CertificateData, config?: PDFConfig): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Get page dimensions based on layout config
  const { width: pageWidth, height: pageHeight } = getPageDimensions(config?.layout);
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Embed fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Get colors
  const colors = {
    primary: getColor(config?.colors, 'primary'),
    secondary: getColor(config?.colors, 'secondary'),
    accent: getColor(config?.colors, 'accent'),
    background: getColor(config?.colors, 'background'),
    text: getColor(config?.colors, 'text'),
    textMuted: getColor(config?.colors, 'textMuted'),
    border: getColor(config?.colors, 'border'),
  };

  // Content config with defaults
  const content = {
    showSubtitle: config?.content?.showSubtitle ?? true,
    showHours: config?.content?.showHours ?? true,
    showGrade: config?.content?.showGrade ?? true,
    showDate: config?.content?.showDate ?? true,
    showInstructor: config?.content?.showInstructor ?? true,
    showCertificateNumber: config?.content?.showCertificateNumber ?? true,
    showQR: config?.content?.showQR ?? true,
    showOrganizationName: config?.content?.showOrganizationName ?? true,
    headerText: config?.content?.headerText || 'CERTIFICADO DE',
    subtitleTemplate: config?.content?.subtitleTemplate || (data.certificate_type === 'completion' ? 'COMPLETACION' : 'PARTICIPACION'),
  };

  // Draw background
  drawBackground(page, pageWidth, pageHeight, colors);

  // Draw border and get margin
  const margin = drawBorder(page, pageWidth, pageHeight, config?.border, colors);

  // Draw logo
  await drawLogo(page, pdfDoc, pageWidth, pageHeight, margin, config?.layout, config?.branding);

  // Draw organization name
  drawOrganizationName(page, pageWidth, pageHeight, margin, config?.branding, content, helveticaFont, helveticaBold, colors);

  // Title - adjust Y if organization name is shown
  const hasOrgName = content.showOrganizationName && config?.branding?.organizationName;
  const hasOrgSubtitle = hasOrgName && config?.branding?.organizationSubtitle;
  let currentY = pageHeight - margin - (hasOrgSubtitle ? 100 : hasOrgName ? 85 : 80);
  const titleWidth = helveticaBold.widthOfTextAtSize(content.headerText, 28);
  page.drawText(content.headerText, {
    x: (pageWidth - titleWidth) / 2,
    y: currentY,
    size: 28,
    font: helveticaBold,
    color: rgb(colors.primary.r, colors.primary.g, colors.primary.b),
  });

  // Subtitle
  if (content.showSubtitle) {
    currentY -= 35;
    const subtitleWidth = helveticaBold.widthOfTextAtSize(content.subtitleTemplate, 24);
    page.drawText(content.subtitleTemplate, {
      x: (pageWidth - subtitleWidth) / 2,
      y: currentY,
      size: 24,
      font: helveticaBold,
      color: rgb(colors.primary.r, colors.primary.g, colors.primary.b),
    });
  }

  // "Se certifica que"
  currentY -= 50;
  const certifyText = 'Se certifica que';
  const certifyWidth = timesItalic.widthOfTextAtSize(certifyText, 14);
  page.drawText(certifyText, {
    x: (pageWidth - certifyWidth) / 2,
    y: currentY,
    size: 14,
    font: timesItalic,
    color: rgb(colors.text.r, colors.text.g, colors.text.b),
  });

  // Student name
  currentY -= 45;
  const nameWidth = timesRoman.widthOfTextAtSize(data.student_name, 32);
  page.drawText(data.student_name, {
    x: (pageWidth - nameWidth) / 2,
    y: currentY,
    size: 32,
    font: timesRoman,
    color: rgb(colors.primary.r, colors.primary.g, colors.primary.b),
  });

  // Divider
  currentY -= 30;
  drawDivider(page, pageWidth, currentY, config?.ornaments?.dividerStyle || 'simple', colors);

  // Course name
  currentY -= 35;
  const courseWidth = helveticaFont.widthOfTextAtSize(data.course_name, 16);
  page.drawText(data.course_name, {
    x: (pageWidth - courseWidth) / 2,
    y: currentY,
    size: 16,
    font: helveticaFont,
    color: rgb(colors.text.r, colors.text.g, colors.text.b),
  });

  // Details row (conditionally show date, hours, grade)
  currentY -= 40;
  const detailsText: string[] = [];

  if (content.showDate) {
    const issueDate = new Date(data.issue_date);
    const formattedDate = issueDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    detailsText.push(formattedDate);
  }

  if (content.showHours && data.hours) {
    detailsText.push(`${data.hours} horas`);
  }

  if (content.showGrade && data.grade) {
    detailsText.push(`${data.grade}%`);
  }

  if (detailsText.length > 0) {
    const detailsString = detailsText.join('     •     ');
    const detailsWidth = helveticaFont.widthOfTextAtSize(detailsString, 11);
    page.drawText(detailsString, {
      x: (pageWidth - detailsWidth) / 2,
      y: currentY,
      size: 11,
      font: helveticaFont,
      color: rgb(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b),
    });
  }

  // Signatures section - use branding signatures if available, otherwise use instructor name
  currentY -= 50;

  const hasBrandingSignature = config?.branding?.signatureImage || config?.branding?.signatureLabel;

  if (hasBrandingSignature) {
    // Use branding signature(s) with image support
    currentY = await drawSignatures(
      page,
      pdfDoc,
      pageWidth,
      margin,
      currentY,
      config?.layout,
      config?.branding,
      helveticaFont,
      colors.text
    );
  } else if (content.showInstructor && data.instructor_name) {
    // Fallback to instructor name without image
    const showLine = config?.layout?.showSignatureLine ?? true;

    if (showLine) {
      const sigLineWidth = 150;
      page.drawLine({
        start: { x: (pageWidth - sigLineWidth) / 2, y: currentY },
        end: { x: (pageWidth + sigLineWidth) / 2, y: currentY },
        thickness: 1,
        color: rgb(colors.text.r, colors.text.g, colors.text.b),
      });
    }

    currentY -= 15;
    const instructorWidth = helveticaFont.widthOfTextAtSize(data.instructor_name, 11);
    page.drawText(data.instructor_name, {
      x: (pageWidth - instructorWidth) / 2,
      y: currentY,
      size: 11,
      font: helveticaFont,
      color: rgb(colors.text.r, colors.text.g, colors.text.b),
    });
  }

  // QR Code - draw first to know its position
  const qrPosition = config?.layout?.qrPosition || 'bottom-right';
  const qrSize = QR_SIZES[config?.layout?.qrSize || 'medium'];

  if (content.showQR) {
    await drawQRCode(
      page,
      pdfDoc,
      pageWidth,
      pageHeight,
      margin,
      config?.layout,
      data.certificate_number,
      helveticaFont,
      colors.text
    );
  }

  // Certificate number - position opposite to QR to avoid overlap
  if (content.showCertificateNumber) {
    const certNumText = `N° ${data.certificate_number}`;
    const certNumWidth = helveticaFont.widthOfTextAtSize(certNumText, 9);

    let certNumX: number;

    // Position certificate number on opposite side of QR
    if (qrPosition === 'bottom-left') {
      // QR is left, put number on right
      certNumX = pageWidth - margin - certNumWidth - 30;
    } else if (qrPosition === 'bottom-center') {
      // QR is center, put number on left
      certNumX = margin + 30;
    } else {
      // QR is right (default), put number on left
      certNumX = margin + 30;
    }

    page.drawText(certNumText, {
      x: certNumX,
      y: margin + 30,
      size: 9,
      font: helveticaFont,
      color: rgb(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b),
    });
  }

  return await pdfDoc.save();
}
