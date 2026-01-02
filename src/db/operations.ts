/**
 * Certificate Database Operations using Drizzle ORM
 * Migrated from Supabase client to Neon PostgreSQL
 */
import { eq, desc, sql, and, count } from 'drizzle-orm';
import { db } from './index';
import {
  certificates,
  certificateValidations,
  Certificate,
  NewCertificate,
  CertificateValidation,
  NewCertificateValidation,
} from './schema';
import { generateCertificateNumber, getValidationUrl } from '@/lib/utils';

// Type for certificate form data (compatible with existing forms)
export interface CertificateFormData {
  student_name: string;
  student_email: string;
  course_name: string;
  certificate_type: 'participation' | 'completion';
  instructor_name?: string;
  hours?: number;
  grade?: number;
  issue_date: string;
}

/**
 * Create a new certificate
 */
export async function createCertificate(
  data: CertificateFormData
): Promise<{ certificate: Certificate | null; error: string | null }> {
  try {
    const certificateNumber = generateCertificateNumber();

    const [certificate] = await db
      .insert(certificates)
      .values({
        certificateNumber,
        studentName: data.student_name,
        studentEmail: data.student_email,
        courseName: data.course_name,
        certificateType: data.certificate_type,
        instructorName: data.instructor_name || null,
        hours: data.hours || null,
        grade: data.grade?.toString() || null,
        issueDate: new Date(data.issue_date),
        qrCodeUrl: getValidationUrl(certificateNumber),
        metadata: {},
      })
      .returning();

    return { certificate, error: null };
  } catch (error) {
    console.error('Error creating certificate:', error);
    return {
      certificate: null,
      error: error instanceof Error ? error.message : 'Error creating certificate',
    };
  }
}

/**
 * Get certificate by number
 */
export async function getCertificateByNumber(
  certificateNumber: string
): Promise<{ certificate: Certificate | null; error: string | null }> {
  try {
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(
        and(
          eq(certificates.certificateNumber, certificateNumber),
          eq(certificates.isActive, true)
        )
      )
      .limit(1);

    if (!certificate) {
      return { certificate: null, error: 'Certificado no encontrado' };
    }

    return { certificate, error: null };
  } catch (error) {
    console.error('Error getting certificate:', error);
    return {
      certificate: null,
      error: error instanceof Error ? error.message : 'Error fetching certificate',
    };
  }
}

/**
 * Get certificate by ID
 */
export async function getCertificateById(
  id: string
): Promise<{ certificate: Certificate | null; error: string | null }> {
  try {
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1);

    if (!certificate) {
      return { certificate: null, error: 'Certificado no encontrado' };
    }

    return { certificate, error: null };
  } catch (error) {
    console.error('Error getting certificate by ID:', error);
    return {
      certificate: null,
      error: error instanceof Error ? error.message : 'Error fetching certificate',
    };
  }
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
  try {
    await db.insert(certificateValidations).values({
      certificateId,
      isValid,
      validationMethod: method,
      validatedByIp: ipAddress || null,
    });

    return { error: null };
  } catch (error) {
    console.error('Error recording validation:', error);
    return {
      error: error instanceof Error ? error.message : 'Error recording validation',
    };
  }
}

/**
 * Get validation count for a certificate
 */
export async function getValidationCount(
  certificateId: string
): Promise<{ count: number; error: string | null }> {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(certificateValidations)
      .where(eq(certificateValidations.certificateId, certificateId));

    return { count: result?.count || 0, error: null };
  } catch (error) {
    console.error('Error getting validation count:', error);
    return {
      count: 0,
      error: error instanceof Error ? error.message : 'Error getting validation count',
    };
  }
}

/**
 * Update certificate PDF URL
 */
export async function updateCertificatePdfUrl(
  certificateId: string,
  pdfUrl: string
): Promise<{ error: string | null }> {
  try {
    await db
      .update(certificates)
      .set({ pdfUrl })
      .where(eq(certificates.id, certificateId));

    return { error: null };
  } catch (error) {
    console.error('Error updating PDF URL:', error);
    return {
      error: error instanceof Error ? error.message : 'Error updating PDF URL',
    };
  }
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
  try {
    const offset = (page - 1) * limit;

    const [certificateList, countResult] = await Promise.all([
      db
        .select()
        .from(certificates)
        .orderBy(desc(certificates.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(certificates),
    ]);

    return {
      certificates: certificateList,
      total: countResult[0]?.count || 0,
      error: null,
    };
  } catch (error) {
    console.error('Error listing certificates:', error);
    return {
      certificates: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Error listing certificates',
    };
  }
}

/**
 * Deactivate a certificate
 */
export async function deactivateCertificate(
  certificateId: string
): Promise<{ error: string | null }> {
  try {
    await db
      .update(certificates)
      .set({ isActive: false })
      .where(eq(certificates.id, certificateId));

    return { error: null };
  } catch (error) {
    console.error('Error deactivating certificate:', error);
    return {
      error: error instanceof Error ? error.message : 'Error deactivating certificate',
    };
  }
}

/**
 * Revoke a certificate with reason
 */
export async function revokeCertificate(
  certificateNumber: string,
  reason: string
): Promise<{ error: string | null }> {
  try {
    const result = await db
      .update(certificates)
      .set({
        revokedAt: new Date(),
        revocationReason: reason,
      })
      .where(eq(certificates.certificateNumber, certificateNumber))
      .returning({ certificateNumber: certificates.certificateNumber });

    if (result.length === 0) {
      return { error: 'Certificado no encontrado' };
    }

    return { error: null };
  } catch (error) {
    console.error('Error revoking certificate:', error);
    return {
      error: error instanceof Error ? error.message : 'Error revoking certificate',
    };
  }
}

/**
 * Get certificate for validation (public data only)
 */
export async function getCertificateForValidation(
  certificateNumber: string
): Promise<{
  certificate: Partial<Certificate> | null;
  error: string | null;
}> {
  try {
    const [certificate] = await db
      .select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        studentName: certificates.studentName,
        courseName: certificates.courseName,
        certificateType: certificates.certificateType,
        issueDate: certificates.issueDate,
        instructorName: certificates.instructorName,
        hours: certificates.hours,
        grade: certificates.grade,
        isActive: certificates.isActive,
        revokedAt: certificates.revokedAt,
        revocationReason: certificates.revocationReason,
        createdAt: certificates.createdAt,
      })
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber))
      .limit(1);

    if (!certificate) {
      return { certificate: null, error: 'Certificado no encontrado' };
    }

    return { certificate, error: null };
  } catch (error) {
    console.error('Error getting certificate for validation:', error);
    return {
      certificate: null,
      error:
        error instanceof Error ? error.message : 'Error fetching certificate',
    };
  }
}

/**
 * Check if certificate is revoked
 */
export async function isCertificateRevoked(
  certificateNumber: string
): Promise<{ revoked: boolean; reason: string | null; error: string | null }> {
  try {
    const [certificate] = await db
      .select({
        revokedAt: certificates.revokedAt,
        revocationReason: certificates.revocationReason,
      })
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber))
      .limit(1);

    if (!certificate) {
      return { revoked: false, reason: null, error: 'Certificado no encontrado' };
    }

    return {
      revoked: certificate.revokedAt !== null,
      reason: certificate.revocationReason,
      error: null,
    };
  } catch (error) {
    console.error('Error checking revocation status:', error);
    return {
      revoked: false,
      reason: null,
      error: error instanceof Error ? error.message : 'Error checking revocation',
    };
  }
}
