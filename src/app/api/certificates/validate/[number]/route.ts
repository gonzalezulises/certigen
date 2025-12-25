import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isValidCertificateNumber } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const resolvedParams = await params;
    const certificateNumber = resolvedParams.number;

    // Validate certificate number format
    if (!isValidCertificateNumber(certificateNumber)) {
      return NextResponse.json(
        {
          is_valid: false,
          error: 'Formato de numero de certificado invalido',
        },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || null;

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

    // Find certificate
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_number', certificateNumber)
      .eq('is_active', true)
      .single();

    if (certError || !certificate) {
      // Certificate not found - could be invalid or ephemeral (anonymous)
      return NextResponse.json({
        is_valid: false,
        error: 'Certificado no encontrado. Si fue generado en modo anonimo, no puede ser validado en linea.',
        message_type: 'not_found',
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

    return NextResponse.json({
      is_valid: true,
      certificate,
      validation_count: count || 1,
    });
  } catch (error) {
    console.error('Validate certificate error:', error);
    return NextResponse.json(
      {
        is_valid: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}
