import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { certificateFormSchema } from '@/types/certificate';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = certificateFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

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

    // Generate unique certificate number
    const certificateNumber = generateCertificateNumber();

    // Create certificate in database
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
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
