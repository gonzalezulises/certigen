import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';

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

    // Create Supabase admin client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );

    // Generate certificate number
    const certificateNumber = generateCertificateNumber();

    // Create certificate
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert({
        certificate_number: certificateNumber,
        student_name: body.student_name,
        student_email: body.student_email,
        course_name: body.course_name,
        course_id: body.course_id || null,
        user_id: body.user_id || null,
        certificate_type: body.certificate_type || 'completion',
        instructor_name: body.instructor_name || null,
        hours: body.hours || null,
        grade: body.grade || null,
        issue_date: body.issue_date || new Date().toISOString(),
        qr_code_url: getValidationUrl(certificateNumber),
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Error al crear el certificado', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        certificate_number: certificate.certificate_number,
        student_name: certificate.student_name,
        course_name: certificate.course_name,
        issue_date: certificate.issue_date,
        validation_url: getValidationUrl(certificate.certificate_number),
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

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );

    let query = supabase.from('certificates').select('*');

    if (certificateId) {
      query = query.eq('id', certificateId);
    } else if (certificateNumber) {
      query = query.eq('certificate_number', certificateNumber);
    }

    const { data: certificate, error } = await query.single();

    if (error || !certificate) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Integration API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
