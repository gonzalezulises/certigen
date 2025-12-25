export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      certificates: {
        Row: {
          id: string
          certificate_number: string
          user_id: string | null
          course_id: string | null
          course_name: string
          student_name: string
          student_email: string
          certificate_type: 'participation' | 'completion'
          issue_date: string
          expiry_date: string | null
          instructor_name: string | null
          hours: number | null
          grade: number | null
          metadata: Json
          qr_code_url: string | null
          pdf_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          certificate_number: string
          user_id?: string | null
          course_id?: string | null
          course_name: string
          student_name: string
          student_email: string
          certificate_type: 'participation' | 'completion'
          issue_date?: string
          expiry_date?: string | null
          instructor_name?: string | null
          hours?: number | null
          grade?: number | null
          metadata?: Json
          qr_code_url?: string | null
          pdf_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          certificate_number?: string
          user_id?: string | null
          course_id?: string | null
          course_name?: string
          student_name?: string
          student_email?: string
          certificate_type?: 'participation' | 'completion'
          issue_date?: string
          expiry_date?: string | null
          instructor_name?: string | null
          hours?: number | null
          grade?: number | null
          metadata?: Json
          qr_code_url?: string | null
          pdf_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      certificate_templates: {
        Row: {
          id: string
          name: string
          html_template: string
          css_styles: string | null
          background_image_url: string | null
          placeholders: Json
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          html_template: string
          css_styles?: string | null
          background_image_url?: string | null
          placeholders: Json
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          html_template?: string
          css_styles?: string | null
          background_image_url?: string | null
          placeholders?: Json
          is_default?: boolean
          created_at?: string
        }
      }
      certificate_validations: {
        Row: {
          id: string
          certificate_id: string
          validated_at: string
          validated_by_ip: string | null
          is_valid: boolean
          validation_method: string
        }
        Insert: {
          id?: string
          certificate_id: string
          validated_at?: string
          validated_by_ip?: string | null
          is_valid: boolean
          validation_method: string
        }
        Update: {
          id?: string
          certificate_id?: string
          validated_at?: string
          validated_by_ip?: string | null
          is_valid?: boolean
          validation_method?: string
        }
      }
      eduplatform_integration: {
        Row: {
          id: string
          course_id: string | null
          certificate_template_id: string | null
          auto_generate: boolean
          integration_key: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          certificate_template_id?: string | null
          auto_generate?: boolean
          integration_key: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          certificate_template_id?: string | null
          auto_generate?: boolean
          integration_key?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
