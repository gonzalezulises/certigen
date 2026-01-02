import { NextRequest, NextResponse } from 'next/server';
import { eq, count } from 'drizzle-orm';
import { isValidCertificateNumber } from '@/lib/utils';
import { generalRatelimit, getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';
import { db, certificates, certificateValidations } from '@/db';

// Helper to create response with security headers
function createSecureResponse(data: object, status: number = 200) {
  const response = NextResponse.json(data, { status });
  // Prevent search engine indexing of validation responses
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(generalRatelimit, clientIp);
    if (rateLimitResult && !rateLimitResult.success) {
      return rateLimitExceededResponse(rateLimitResult.reset);
    }

    const resolvedParams = await params;
    const certificateNumber = resolvedParams.number;

    // Validate certificate number format
    if (!isValidCertificateNumber(certificateNumber)) {
      return createSecureResponse(
        {
          is_valid: false,
          error: 'Formato de numero de certificado invalido',
        },
        400
      );
    }

    // Find certificate - select only needed fields
    const [certificate] = await db
      .select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        studentName: certificates.studentName,
        courseName: certificates.courseName,
        certificateType: certificates.certificateType,
        issueDate: certificates.issueDate,
        isActive: certificates.isActive,
        revokedAt: certificates.revokedAt,
        revocationReason: certificates.revocationReason,
      })
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber))
      .limit(1);

    if (!certificate) {
      // Certificate not found
      return createSecureResponse({
        is_valid: false,
        error: 'Certificado no encontrado.',
        message_type: 'not_found',
      });
    }

    // Check if certificate is active
    if (!certificate.isActive) {
      return createSecureResponse({
        is_valid: false,
        error: 'Este certificado ha sido desactivado.',
        message_type: 'inactive',
      });
    }

    // Check if certificate is revoked
    if (certificate.revokedAt) {
      return createSecureResponse({
        is_valid: false,
        revoked: true,
        revoked_at: certificate.revokedAt,
        reason: certificate.revocationReason,
        error: 'Este certificado ha sido revocado.',
        message_type: 'revoked',
      });
    }

    // Record validation
    await db.insert(certificateValidations).values({
      certificateId: certificate.id,
      isValid: true,
      validationMethod: 'number',
      validatedByIp: clientIp,
    });

    // Get validation count
    const [countResult] = await db
      .select({ count: count() })
      .from(certificateValidations)
      .where(eq(certificateValidations.certificateId, certificate.id));

    // Return minimal data for validation (no PII like email, grade, hours)
    return createSecureResponse({
      is_valid: true,
      certificate: {
        certificate_number: certificate.certificateNumber,
        student_name: certificate.studentName,
        course_name: certificate.courseName,
        certificate_type: certificate.certificateType,
        issue_date: certificate.issueDate,
      },
      validation_count: countResult?.count || 1,
    });
  } catch (error) {
    console.error('Validate certificate error:', error);
    return createSecureResponse(
      {
        is_valid: false,
        error: 'Error interno del servidor',
      },
      500
    );
  }
}
