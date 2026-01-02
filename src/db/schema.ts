/**
 * Drizzle ORM Schema for CertiGen
 * Migrated from Supabase PostgreSQL
 */
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  inet,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================
// 1. Certificates Table
// ============================================
export const certificates = pgTable(
  'certificates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    certificateNumber: varchar('certificate_number', { length: 50 }).unique().notNull(),
    // Removed: user_id reference to auth.users - not needed for Neon migration
    userId: uuid('user_id'), // Optional, kept for backwards compatibility but no FK
    courseId: uuid('course_id'),
    courseName: varchar('course_name', { length: 255 }).notNull(),
    studentName: varchar('student_name', { length: 255 }).notNull(),
    studentEmail: varchar('student_email', { length: 255 }).notNull(),
    certificateType: varchar('certificate_type', { length: 20 })
      .notNull()
      .default('participation'),
    issueDate: timestamp('issue_date', { withTimezone: true }).defaultNow(),
    expiryDate: timestamp('expiry_date', { withTimezone: true }),
    instructorName: varchar('instructor_name', { length: 255 }),
    hours: integer('hours'),
    grade: decimal('grade', { precision: 5, scale: 2 }),
    metadata: jsonb('metadata').default({}),
    qrCodeUrl: text('qr_code_url'),
    pdfUrl: text('pdf_url'),
    isActive: boolean('is_active').default(true),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revocationReason: text('revocation_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_certificates_number').on(table.certificateNumber),
    index('idx_certificates_email').on(table.studentEmail),
    index('idx_certificates_course').on(table.courseId),
    index('idx_certificates_active').on(table.isActive),
    index('idx_certificates_created').on(table.createdAt),
    index('idx_certificates_user_id').on(table.userId),
  ]
);

// ============================================
// 2. Certificate Templates Table
// ============================================
export const certificateTemplates = pgTable(
  'certificate_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    htmlTemplate: text('html_template').notNull(),
    cssStyles: text('css_styles'),
    backgroundImageUrl: text('background_image_url'),
    placeholders: jsonb('placeholders').notNull().default({}),
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_templates_default').on(table.isDefault)]
);

// ============================================
// 3. Certificate Validations Table
// ============================================
export const certificateValidations = pgTable(
  'certificate_validations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    certificateId: uuid('certificate_id')
      .notNull()
      .references(() => certificates.id, { onDelete: 'cascade' }),
    validatedAt: timestamp('validated_at', { withTimezone: true }).defaultNow(),
    validatedByIp: inet('validated_by_ip'),
    isValid: boolean('is_valid').notNull(),
    validationMethod: varchar('validation_method', { length: 20 }).notNull(),
  },
  (table) => [
    index('idx_validations_certificate').on(table.certificateId),
    index('idx_validations_date').on(table.validatedAt),
  ]
);

// ============================================
// 4. EduPlatform Integration Table
// ============================================
export const eduplatformIntegration = pgTable(
  'eduplatform_integration',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id'),
    certificateTemplateId: uuid('certificate_template_id').references(
      () => certificateTemplates.id,
      { onDelete: 'set null' }
    ),
    autoGenerate: boolean('auto_generate').default(false),
    integrationKey: varchar('integration_key', { length: 100 }).unique().notNull(),
    webhookUrl: text('webhook_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_integration_key').on(table.integrationKey)]
);

// ============================================
// 5. API Keys Table
// ============================================
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    keyHash: varchar('key_hash', { length: 255 }).notNull(),
    permissions: jsonb('permissions').default({ generate: true, validate: true }),
    isActive: boolean('is_active').default(true),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  },
  (table) => [index('idx_api_keys_active').on(table.isActive)]
);

// ============================================
// Type Inference Helpers
// ============================================
export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;

export type CertificateTemplate = typeof certificateTemplates.$inferSelect;
export type NewCertificateTemplate = typeof certificateTemplates.$inferInsert;

export type CertificateValidation = typeof certificateValidations.$inferSelect;
export type NewCertificateValidation = typeof certificateValidations.$inferInsert;

export type EduPlatformIntegration = typeof eduplatformIntegration.$inferSelect;
export type NewEduPlatformIntegration = typeof eduplatformIntegration.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
