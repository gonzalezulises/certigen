import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { adminRatelimit, getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

const revokeSchema = z.object({
  certificate_number: z.string().min(1, 'Certificate number is required'),
  reason: z.string().min(1, 'Revocation reason is required').max(500),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (admin: 20 req/min)
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(adminRatelimit, clientIp);
    if (rateLimitResult && !rateLimitResult.success) {
      return rateLimitExceededResponse(rateLimitResult.reset);
    }

    // Require API secret for revocation (admin only)
    const apiSecret = request.headers.get('x-api-secret');
    if (!apiSecret || apiSecret !== process.env.CERTIGEN_API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin API secret required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = revokeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { certificate_number, reason } = validationResult.data;

    // Create Supabase client with service role for admin operations
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Check if certificate exists
    const { data: certificate, error: fetchError } = await supabase
      .from('certificates')
      .select('certificate_number, revoked_at')
      .eq('certificate_number', certificate_number)
      .single();

    if (fetchError || !certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Check if already revoked
    if (certificate.revoked_at) {
      return NextResponse.json(
        { error: 'Certificate is already revoked', revoked_at: certificate.revoked_at },
        { status: 409 }
      );
    }

    // Revoke the certificate
    const { error: updateError } = await supabase
      .from('certificates')
      .update({
        revoked_at: new Date().toISOString(),
        revocation_reason: reason,
      })
      .eq('certificate_number', certificate_number);

    if (updateError) {
      console.error('Revocation error:', updateError);
      return NextResponse.json(
        { error: 'Failed to revoke certificate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      revoked: certificate_number,
      revoked_at: new Date().toISOString(),
      reason,
    });
  } catch (error) {
    console.error('Revocation endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
