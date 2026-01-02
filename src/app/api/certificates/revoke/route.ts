import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { adminRatelimit, getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';
import { db, certificates } from '@/db';

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

    // Check if certificate exists
    const [certificate] = await db
      .select({
        certificateNumber: certificates.certificateNumber,
        revokedAt: certificates.revokedAt,
      })
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificate_number))
      .limit(1);

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Check if already revoked
    if (certificate.revokedAt) {
      return NextResponse.json(
        { error: 'Certificate is already revoked', revoked_at: certificate.revokedAt },
        { status: 409 }
      );
    }

    // Revoke the certificate
    const revokedAt = new Date();
    await db
      .update(certificates)
      .set({
        revokedAt,
        revocationReason: reason,
      })
      .where(eq(certificates.certificateNumber, certificate_number));

    return NextResponse.json({
      success: true,
      revoked: certificate_number,
      revoked_at: revokedAt.toISOString(),
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
