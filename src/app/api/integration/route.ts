import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';
import { db, certificates } from '@/db';

// Verify API key middleware
async function verifyApiKey(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const apiKey = authHeader.substring(7);
  const expectedKey = process.env.CERTIGEN_API_SECRET;

  // For now, simple comparison. In production, use hashed keys from database
  return apiKey === expectedKey;
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const isAuthorized = await verifyApiKey(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['student_name', 'student_email', 'course_name'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate certificate number
    const certificateNumber = generateCertificateNumber();

    // Create certificate
    const [certificate] = await db
      .insert(certificates)
      .values({
        certificateNumber,
        studentName: body.student_name,
        studentEmail: body.student_email,
        courseName: body.course_name,
        courseId: body.course_id || null,
        userId: body.user_id || null,
        certificateType: body.certificate_type || 'completion',
        instructorName: body.instructor_name || null,
        hours: body.hours || null,
        grade: body.grade?.toString() || null,
        issueDate: body.issue_date ? new Date(body.issue_date) : new Date(),
        qrCodeUrl: getValidationUrl(certificateNumber),
        metadata: body.metadata || {},
      })
      .returning();

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        certificate_number: certificate.certificateNumber,
        student_name: certificate.studentName,
        course_name: certificate.courseName,
        issue_date: certificate.issueDate,
        validation_url: getValidationUrl(certificate.certificateNumber),
      },
    });
  } catch (error) {
    console.error('Integration API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Get certificate by ID (for integration)
export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await verifyApiKey(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    const certificateNumber = searchParams.get('number');

    if (!certificateId && !certificateNumber) {
      return NextResponse.json(
        { error: 'Se requiere id o number' },
        { status: 400 }
      );
    }

    let certificate;

    if (certificateId) {
      [certificate] = await db
        .select()
        .from(certificates)
        .where(eq(certificates.id, certificateId))
        .limit(1);
    } else if (certificateNumber) {
      [certificate] = await db
        .select()
        .from(certificates)
        .where(eq(certificates.certificateNumber, certificateNumber))
        .limit(1);
    }

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

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
      expiry_date: certificate.expiryDate,
      qr_code_url: certificate.qrCodeUrl,
      pdf_url: certificate.pdfUrl,
      is_active: certificate.isActive,
      revoked_at: certificate.revokedAt,
      revocation_reason: certificate.revocationReason,
      created_at: certificate.createdAt,
      metadata: certificate.metadata,
    };

    return NextResponse.json({
      success: true,
      certificate: responseData,
    });
  } catch (error) {
    console.error('Integration API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
