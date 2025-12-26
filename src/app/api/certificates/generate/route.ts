import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { certificateFormSchema, authenticatedCertificateFormSchema } from '@/types/certificate';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create Supabase client FIRST to check auth
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

    // Check if user is authenticated BEFORE validation
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch (authError) {
      console.log('Auth check failed, proceeding as anonymous:', authError);
      // Continue as anonymous user
    }

    // Use appropriate schema based on auth status
    const schema = user ? authenticatedCertificateFormSchema : certificateFormSchema;
    const validationResult = schema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate unique certificate number
    const certificateNumber = generateCertificateNumber();

    if (user) {
      // AUTHENTICATED: Save to database with user_id
      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
          certificate_number: certificateNumber,
          student_name: data.student_name,
          student_email: data.student_email,
          course_name: data.course_name,
          certificate_type: data.certificate_type,
          instructor_name: data.instructor_name || null,
          hours: data.hours || null,
          grade: data.grade || null,
          issue_date: data.issue_date,
          qr_code_url: getValidationUrl(certificateNumber),
          user_id: user.id,
          metadata: {
            template_id: body.template_id || 'elegant',
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Error al guardar el certificado', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        certificate,
        persisted: true,
      });
    } else {
      // ANONYMOUS: Return ephemeral certificate (not saved to DB)
      // Generate a verification hash for validation without storage
      const verificationData = `${certificateNumber}-${data.student_name}-${data.course_name}-${data.issue_date}`;
      const verificationHash = crypto.createHash('sha256').update(verificationData).digest('hex').substring(0, 16);

      const ephemeralCertificate = {
        id: `ephemeral-${Date.now()}`,
        certificate_number: certificateNumber,
        student_name: data.student_name,
        student_email: data.student_email,
        course_name: data.course_name,
        certificate_type: data.certificate_type,
        instructor_name: data.instructor_name || null,
        hours: data.hours || null,
        grade: data.grade || null,
        issue_date: data.issue_date,
        qr_code_url: getValidationUrl(certificateNumber),
        verification_hash: verificationHash,
        is_active: true,
        created_at: new Date().toISOString(),
        metadata: {
          template_id: body.template_id || 'elegant',
          ephemeral: true,
        },
      };

      return NextResponse.json({
        success: true,
        certificate: ephemeralCertificate,
        persisted: false,
        message: 'Certificado generado en modo anonimo. No se guarda en base de datos.',
      });
    }
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
