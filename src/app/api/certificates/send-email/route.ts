import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL, CertificateEmail } from '@/lib/email';
import { formatDate, getValidationUrl } from '@/lib/utils';
import { render } from '@react-email/components';

interface SendEmailRequest {
  to: string;
  studentName: string;
  courseName: string;
  certificateNumber: string;
  certificateType: 'participation' | 'completion';
  issueDate: string;
  organizationName?: string;
  instructorName?: string;
  hours?: number;
  grade?: number;
  pdfBase64?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();

    const {
      to,
      studentName,
      courseName,
      certificateNumber,
      certificateType,
      issueDate,
      organizationName,
      instructorName,
      hours,
      grade,
      pdfBase64,
    } = body;

    // Validate required fields
    if (!to || !studentName || !courseName || !certificateNumber) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const validationUrl = getValidationUrl(certificateNumber);
    const typeLabel = certificateType === 'completion' ? 'Aprobacion' : 'Participacion';

    // Prepare attachments
    const attachments = pdfBase64
      ? [
          {
            filename: `certificado-${certificateNumber}.pdf`,
            content: pdfBase64,
          },
        ]
      : [];

    // Render email HTML
    const emailHtml = await render(
      CertificateEmail({
        studentName,
        courseName,
        certificateNumber,
        certificateType,
        issueDate: formatDate(issueDate),
        organizationName,
        instructorName,
        hours,
        grade,
        validationUrl,
        pdfAttached: !!pdfBase64,
      })
    );

    // Send email
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Tu Certificado de ${typeLabel} - ${courseName}`,
      html: emailHtml,
      attachments,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: error.message || 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error('Error in send-email endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
