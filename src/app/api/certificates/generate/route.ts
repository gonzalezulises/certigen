import { NextRequest, NextResponse } from 'next/server';
import { certificateFormSchema } from '@/types/certificate';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';
import { db, certificates } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate form data
    const validationResult = certificateFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate unique certificate number
    const certificateNumber = generateCertificateNumber();

    // Save to database
    const [certificate] = await db
      .insert(certificates)
      .values({
        certificateNumber,
        studentName: data.student_name,
        studentEmail: data.student_email || '',
        courseName: data.course_name,
        certificateType: data.certificate_type,
        instructorName: data.instructor_name || null,
        hours: data.hours || null,
        grade: data.grade?.toString() || null,
        issueDate: new Date(data.issue_date),
        qrCodeUrl: getValidationUrl(certificateNumber),
        metadata: {
          template_id: body.template_id || 'elegant',
        },
      })
      .returning();

    // Transform to snake_case for API response compatibility
    const responseData = {
      id: certificate.id,
      certificate_number: certificate.certificateNumber,
      student_name: certificate.studentName,
      student_email: certificate.studentEmail,
      course_name: certificate.courseName,
      certificate_type: certificate.certificateType,
      instructor_name: certificate.instructorName,
      hours: certificate.hours,
      grade: certificate.grade,
      issue_date: certificate.issueDate,
      qr_code_url: certificate.qrCodeUrl,
      is_active: certificate.isActive,
      created_at: certificate.createdAt,
      metadata: certificate.metadata,
    };

    return NextResponse.json({
      success: true,
      certificate: responseData,
      persisted: true,
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
