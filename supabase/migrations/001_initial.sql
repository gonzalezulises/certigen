-- ============================================
-- CertiGen Database Schema
-- Sistema de Generación y Validación de Certificados
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Tabla principal de certificados
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id UUID,
  course_name VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  certificate_type VARCHAR(20) CHECK (certificate_type IN ('participation', 'completion')) NOT NULL DEFAULT 'participation',
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  instructor_name VARCHAR(255),
  hours INTEGER,
  grade DECIMAL(5,2) CHECK (grade >= 0 AND grade <= 100),
  metadata JSONB DEFAULT '{}',
  qr_code_url TEXT,
  pdf_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for certificates
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_email ON certificates(student_email);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_active ON certificates(is_active);
CREATE INDEX IF NOT EXISTS idx_certificates_created ON certificates(created_at DESC);

-- ============================================
-- 2. Tabla de plantillas de certificados
-- ============================================
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  html_template TEXT NOT NULL,
  css_styles TEXT,
  background_image_url TEXT,
  placeholders JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for default template lookup
CREATE INDEX IF NOT EXISTS idx_templates_default ON certificate_templates(is_default);

-- ============================================
-- 3. Tabla de validaciones de certificados
-- ============================================
CREATE TABLE IF NOT EXISTS certificate_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE NOT NULL,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_by_ip INET,
  is_valid BOOLEAN NOT NULL,
  validation_method VARCHAR(20) CHECK (validation_method IN ('qr', 'number', 'email')) NOT NULL
);

-- Indexes for validations
CREATE INDEX IF NOT EXISTS idx_validations_certificate ON certificate_validations(certificate_id);
CREATE INDEX IF NOT EXISTS idx_validations_date ON certificate_validations(validated_at DESC);

-- ============================================
-- 4. Tabla de integración con EduPlatform
-- ============================================
CREATE TABLE IF NOT EXISTS eduplatform_integration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID,
  certificate_template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL,
  auto_generate BOOLEAN DEFAULT false,
  integration_key VARCHAR(100) UNIQUE NOT NULL,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for integration key lookup
CREATE INDEX IF NOT EXISTS idx_integration_key ON eduplatform_integration(integration_key);

-- ============================================
-- 5. Tabla de API Keys para integraciones
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '{"generate": true, "validate": true}',
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Index for API key lookup
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduplatform_integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Certificates: Anyone can read active certificates, only authenticated users can create
CREATE POLICY "Public can view active certificates"
  ON certificates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can do anything with certificates"
  ON certificates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon users to insert certificates (for standalone mode)
CREATE POLICY "Anon can create certificates"
  ON certificates FOR INSERT
  TO anon
  WITH CHECK (true);

-- Templates: Anyone can read templates
CREATE POLICY "Public can view templates"
  ON certificate_templates FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage templates"
  ON certificate_templates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Validations: Anyone can create and view validations
CREATE POLICY "Public can create validations"
  ON certificate_validations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view validations"
  ON certificate_validations FOR SELECT
  USING (true);

-- Integration: Only service role
CREATE POLICY "Service role manages integrations"
  ON eduplatform_integration FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- API Keys: Only service role
CREATE POLICY "Service role manages API keys"
  ON api_keys FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Default Templates
-- ============================================
INSERT INTO certificate_templates (name, html_template, css_styles, placeholders, is_default) VALUES
(
  'Elegante',
  '
  <div class="certificate elegant">
    <div class="border-frame">
      <div class="header">
        <h1>CERTIFICADO</h1>
        <p class="subtitle">{{certificate_type_label}}</p>
      </div>
      <div class="body">
        <p class="certify">Se certifica que</p>
        <h2 class="student-name">{{student_name}}</h2>
        <p class="completion">ha {{completion_text}} satisfactoriamente el curso</p>
        <h3 class="course-name">{{course_name}}</h3>
        <p class="details">
          {{#if hours}}Duración: {{hours}} horas | {{/if}}
          {{#if grade}}Calificación: {{grade}}/100{{/if}}
        </p>
      </div>
      <div class="footer">
        <div class="date">
          <p>Fecha de emisión</p>
          <p class="value">{{issue_date}}</p>
        </div>
        <div class="certificate-number">
          <p>Número de certificado</p>
          <p class="value">{{certificate_number}}</p>
        </div>
        <div class="instructor">
          {{#if instructor_name}}
          <p>Instructor</p>
          <p class="value">{{instructor_name}}</p>
          {{/if}}
        </div>
      </div>
      <div class="qr-section">
        <div class="qr-placeholder"></div>
        <p class="verify">Escanea para verificar</p>
      </div>
    </div>
  </div>
  ',
  '
  .certificate.elegant {
    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
    color: #fff;
    padding: 40px;
    font-family: "Georgia", serif;
  }
  .border-frame {
    border: 3px solid #d4af37;
    padding: 40px;
    position: relative;
  }
  .header h1 { font-size: 48px; text-align: center; color: #d4af37; }
  .subtitle { text-align: center; font-size: 24px; margin-top: 10px; }
  .student-name { font-size: 36px; text-align: center; color: #d4af37; margin: 20px 0; }
  .course-name { font-size: 28px; text-align: center; margin: 20px 0; }
  .footer { display: flex; justify-content: space-around; margin-top: 40px; }
  .footer > div { text-align: center; }
  .footer .value { font-weight: bold; margin-top: 5px; }
  ',
  '{"student_name": "Nombre del estudiante", "course_name": "Nombre del curso", "certificate_type_label": "Tipo de certificado", "issue_date": "Fecha de emisión", "certificate_number": "Número de certificado", "instructor_name": "Nombre del instructor", "hours": "Horas", "grade": "Calificación"}',
  true
),
(
  'Minimalista',
  '
  <div class="certificate minimal">
    <div class="content">
      <p class="label">CERTIFICADO DE</p>
      <h1>{{certificate_type_label}}</h1>
      <div class="divider"></div>
      <p class="certify">Otorgado a</p>
      <h2>{{student_name}}</h2>
      <p class="for">Por completar exitosamente</p>
      <h3>{{course_name}}</h3>
      <div class="meta">
        <span>{{issue_date}}</span>
        <span>{{certificate_number}}</span>
      </div>
    </div>
  </div>
  ',
  '
  .certificate.minimal {
    background: #ffffff;
    color: #333;
    padding: 60px;
    font-family: "Helvetica Neue", sans-serif;
  }
  .content { text-align: center; }
  .label { font-size: 14px; letter-spacing: 4px; color: #888; }
  h1 { font-size: 32px; font-weight: 300; margin: 10px 0 30px; }
  .divider { width: 60px; height: 2px; background: #333; margin: 0 auto 30px; }
  h2 { font-size: 42px; font-weight: 600; margin: 20px 0; }
  h3 { font-size: 24px; font-weight: 400; color: #555; }
  .meta { margin-top: 40px; color: #888; }
  .meta span { margin: 0 20px; }
  ',
  '{"student_name": "Nombre del estudiante", "course_name": "Nombre del curso", "certificate_type_label": "Tipo de certificado", "issue_date": "Fecha de emisión", "certificate_number": "Número de certificado"}',
  false
),
(
  'Corporativo',
  '
  <div class="certificate corporate">
    <div class="header">
      <div class="logo-placeholder"></div>
      <h1>CERTIFICADO OFICIAL</h1>
    </div>
    <div class="body">
      <p class="intro">Por medio del presente se hace constar que</p>
      <h2>{{student_name}}</h2>
      <p class="completion">Ha {{completion_text}} satisfactoriamente el programa de formación</p>
      <h3>{{course_name}}</h3>
      <div class="details-grid">
        <div class="detail">
          <span class="label">Duración</span>
          <span class="value">{{hours}} horas</span>
        </div>
        <div class="detail">
          <span class="label">Fecha</span>
          <span class="value">{{issue_date}}</span>
        </div>
        <div class="detail">
          <span class="label">Calificación</span>
          <span class="value">{{grade}}/100</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="signature">
        <div class="line"></div>
        <p>{{instructor_name}}</p>
        <p class="role">Instructor / Director</p>
      </div>
      <div class="seal">
        <p class="cert-number">{{certificate_number}}</p>
      </div>
    </div>
  </div>
  ',
  '
  .certificate.corporate {
    background: #fff;
    border: 8px solid #003366;
    padding: 40px;
    font-family: "Times New Roman", serif;
  }
  .header { text-align: center; border-bottom: 2px solid #003366; padding-bottom: 20px; }
  .header h1 { color: #003366; font-size: 36px; }
  .logo-placeholder { width: 80px; height: 80px; background: #eee; margin: 0 auto 20px; border-radius: 50%; }
  .body { padding: 40px 0; text-align: center; }
  .body h2 { font-size: 32px; color: #003366; }
  .body h3 { font-size: 24px; color: #555; }
  .details-grid { display: flex; justify-content: center; gap: 40px; margin-top: 30px; }
  .detail { text-align: center; }
  .detail .label { display: block; font-size: 12px; color: #888; }
  .detail .value { display: block; font-size: 16px; font-weight: bold; }
  .footer { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
  .signature { text-align: center; }
  .signature .line { width: 200px; border-bottom: 1px solid #333; margin-bottom: 10px; }
  .role { font-size: 12px; color: #888; }
  ',
  '{"student_name": "Nombre del estudiante", "course_name": "Nombre del curso", "certificate_type_label": "Tipo de certificado", "issue_date": "Fecha de emisión", "certificate_number": "Número de certificado", "instructor_name": "Nombre del instructor", "hours": "Horas", "grade": "Calificación"}',
  false
);

-- ============================================
-- Functions
-- ============================================

-- Function to get validation count for a certificate
CREATE OR REPLACE FUNCTION get_validation_count(cert_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM certificate_validations WHERE certificate_id = cert_id;
$$ LANGUAGE SQL STABLE;

-- Function to validate certificate and record the validation
CREATE OR REPLACE FUNCTION validate_certificate(
  cert_number VARCHAR,
  ip_address INET DEFAULT NULL,
  method VARCHAR DEFAULT 'number'
)
RETURNS TABLE (
  is_valid BOOLEAN,
  certificate JSON,
  validation_count INTEGER
) AS $$
DECLARE
  cert_record certificates%ROWTYPE;
  valid BOOLEAN;
  count_val INTEGER;
BEGIN
  -- Find the certificate
  SELECT * INTO cert_record
  FROM certificates
  WHERE certificate_number = cert_number AND is_active = true;

  IF FOUND THEN
    valid := true;

    -- Record the validation
    INSERT INTO certificate_validations (certificate_id, validated_by_ip, is_valid, validation_method)
    VALUES (cert_record.id, ip_address, true, method);

    -- Get validation count
    SELECT get_validation_count(cert_record.id) INTO count_val;

    RETURN QUERY SELECT
      valid,
      row_to_json(cert_record)::JSON,
      count_val;
  ELSE
    RETURN QUERY SELECT
      false,
      NULL::JSON,
      0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers
-- ============================================

-- Update created_at on insert (if not provided)
CREATE OR REPLACE FUNCTION update_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_created_at_certificates
  BEFORE INSERT ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_created_at();

CREATE TRIGGER set_created_at_templates
  BEFORE INSERT ON certificate_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_created_at();
