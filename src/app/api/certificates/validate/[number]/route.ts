import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isValidCertificateNumber } from '@/lib/utils';
import { generalRatelimit, getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

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

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore errors from Server Components
            }
          },
        },
      }
    );

    // Find certificate - select only needed fields
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select('id, certificate_number, student_name, course_name, certificate_type, issue_date, is_active, revoked_at, revocation_reason')
      .eq('certificate_number', certificateNumber)
      .single();

    if (certError || !certificate) {
      // Certificate not found - could be invalid or ephemeral (anonymous)
      return createSecureResponse({
        is_valid: false,
        error: 'Certificado no encontrado. Si fue generado en modo anonimo, no puede ser validado en linea.',
        message_type: 'not_found',
      });
    }

    // Check if certificate is active
    if (!certificate.is_active) {
      return createSecureResponse({
        is_valid: false,
        error: 'Este certificado ha sido desactivado.',
        message_type: 'inactive',
      });
    }

    // Check if certificate is revoked
    if (certificate.revoked_at) {
      return createSecureResponse({
        is_valid: false,
        revoked: true,
        revoked_at: certificate.revoked_at,
        reason: certificate.revocation_reason,
        error: 'Este certificado ha sido revocado.',
        message_type: 'revoked',
      });
    }

    // Record validation
    await supabase.from('certificate_validations').insert({
      certificate_id: certificate.id,
      is_valid: true,
      validation_method: 'number',
      validated_by_ip: clientIp,
    });

    // Get validation count
    const { count } = await supabase
      .from('certificate_validations')
      .select('*', { count: 'exact', head: true })
      .eq('certificate_id', certificate.id);

    // Return minimal data for validation (no PII like email, grade, hours)
    return createSecureResponse({
      is_valid: true,
      certificate: {
        certificate_number: certificate.certificate_number,
        student_name: certificate.student_name,
        course_name: certificate.course_name,
        certificate_type: certificate.certificate_type,
        issue_date: certificate.issue_date,
      },
      validation_count: count || 1,
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
