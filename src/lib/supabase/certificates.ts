import { createClient } from './client';
import { createAdminClient } from './server';
import { Certificate, CertificateFormData } from '@/types/certificate';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';

/**
 * Create a new certificate (client-side)
 */
export async function createCertificate(
  data: CertificateFormData
): Promise<{ certificate: Certificate | null; error: string | null }> {
  const supabase = createClient();
  const certificateNumber = generateCertificateNumber();

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
      metadata: {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating certificate:', error);
    return { certificate: null, error: error.message };
  }

  return { certificate: certificate as Certificate, error: null };
}

/**
 * Get certificate by number
 */
export async function getCertificateByNumber(
  certificateNumber: string
): Promise<{ certificate: Certificate | null; error: string | null }> {
  const supabase = createClient();

  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('certificate_number', certificateNumber)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { certificate: null, error: 'Certificado no encontrado' };
    }
    return { certificate: null, error: error.message };
  }

  return { certificate: certificate as Certificate, error: null };
}

/**
 * Get certificate by ID
 */
export async function getCertificateById(
  id: string
): Promise<{ certificate: Certificate | null; error: string | null }> {
  const supabase = createClient();

  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { certificate: null, error: error.message };
  }

  return { certificate: certificate as Certificate, error: null };
}

/**
 * Record a certificate validation
 */
export async function recordValidation(
  certificateId: string,
  isValid: boolean,
  method: 'qr' | 'number' | 'email',
  ipAddress?: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase.from('certificate_validations').insert({
    certificate_id: certificateId,
    is_valid: isValid,
    validation_method: method,
    validated_by_ip: ipAddress || null,
  });

  if (error) {
    console.error('Error recording validation:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Get validation count for a certificate
 */
export async function getValidationCount(
  certificateId: string
): Promise<{ count: number; error: string | null }> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('certificate_validations')
    .select('*', { count: 'exact', head: true })
    .eq('certificate_id', certificateId);

  if (error) {
    return { count: 0, error: error.message };
  }

  return { count: count || 0, error: null };
}

/**
 * Update certificate PDF URL
 */
export async function updateCertificatePdfUrl(
  certificateId: string,
  pdfUrl: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('certificates')
    .update({ pdf_url: pdfUrl })
    .eq('id', certificateId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * List all certificates (for admin)
 */
export async function listCertificates(
  page: number = 1,
  limit: number = 10
): Promise<{
  certificates: Certificate[];
  total: number;
  error: string | null;
}> {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { certificates: [], total: 0, error: error.message };
  }

  return {
    certificates: (data as Certificate[]) || [],
    total: count || 0,
    error: null,
  };
}

/**
 * Deactivate a certificate
 */
export async function deactivateCertificate(
  certificateId: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('certificates')
    .update({ is_active: false })
    .eq('id', certificateId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
