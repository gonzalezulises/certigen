-- Migration: Add certificate revocation support
-- Run this in Supabase SQL Editor

-- Add revocation columns to certificates table
ALTER TABLE certificates
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revocation_reason TEXT;

-- Create index for faster revocation lookups
CREATE INDEX IF NOT EXISTS idx_certificates_revoked_at
ON certificates(revoked_at)
WHERE revoked_at IS NOT NULL;

-- Update RLS policy to allow service role to update revocation fields
-- (Service role bypasses RLS by default, but this documents the intent)

-- Create a view for certificate validation (excludes sensitive data)
CREATE OR REPLACE VIEW public.certificate_validation_view AS
SELECT
  id,
  certificate_number,
  student_name,
  course_name,
  certificate_type,
  issue_date,
  is_active,
  revoked_at,
  revocation_reason,
  created_at
FROM certificates;

-- Grant access to the validation view
GRANT SELECT ON public.certificate_validation_view TO anon;
GRANT SELECT ON public.certificate_validation_view TO authenticated;

-- Add comment for documentation
COMMENT ON COLUMN certificates.revoked_at IS 'Timestamp when certificate was revoked (null if valid)';
COMMENT ON COLUMN certificates.revocation_reason IS 'Reason for revocation (required when revoked)';
