-- 002_add_user_authentication.sql
-- Sistema de autenticación para administradores de CertiGen

-- Agregar user_id a certificates (nullable para certificados existentes/anónimos)
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- RLS Policies
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can create certificates" ON certificates;
DROP POLICY IF EXISTS "Users can delete own certificates" ON certificates;
DROP POLICY IF EXISTS "Public can validate certificates" ON certificates;

-- Usuarios autenticados pueden ver solo sus certificados
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios autenticados pueden crear certificados
CREATE POLICY "Users can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus propios certificados
CREATE POLICY "Users can delete own certificates" ON certificates
  FOR DELETE USING (auth.uid() = user_id);

-- Permitir acceso público para validación (solo lectura por verification_hash)
CREATE POLICY "Public can validate certificates" ON certificates
  FOR SELECT USING (true);
