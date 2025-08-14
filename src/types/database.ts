// Database types generated from Supabase schema
// This will be regenerated when Supabase local is available

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enum types
export type QuizStatus = 'draft' | 'active' | 'archived'
export type QuestionType = 'single' | 'multi' | 'scale'
export type ScoringRuleType = 'sum' | 'weighted' | 'composite'
export type SessionState = 'started' | 'completed'
export type ProductDeliveryType = 'static_pdf' | 'ai_generated' | 'link'
export type OrderStatus = 'paid' | 'refunded' | 'failed'
export type EmailStatus = 'queued' | 'sent' | 'failed'
export type AdminRole = 'owner' | 'editor' | 'viewer'

// Base types with common fields
interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
}

// Core Quiz Entities
export interface Quiz extends BaseEntity {
  slug: string
  status: QuizStatus
  default_lang: string
  feature_flags?: Json
  theme?: Json
}

export interface QuizTranslation extends BaseEntity {
  quiz_id: string
  lang: string
  field_key: string
  value?: string
}

export interface QuizQuestion extends BaseEntity {
  quiz_id: string
  order: number
  type: QuestionType
  key: string
  help_text?: string
  options?: Json
  scoring?: Json
}

export interface QuizScoringRule extends BaseEntity {
  quiz_id: string
  rule_type: ScoringRuleType
  weights?: Json
  thresholds?: Json
}

export interface QuizPrompt extends BaseEntity {
  quiz_id: string
  lang: string
  system_prompt?: string
  user_prompt?: string
  user_prompt_template?: string
  ai_provider?: string
  ai_model?: string
  variables?: Json
}

// User Journey Entities
export interface Lead extends BaseEntity {
  quiz_id: string
  email: string
  name?: string
  lang: string
  demographics?: Json
  utm?: Json
}

export interface Session extends BaseEntity {
  quiz_id: string
  lead_id?: string
  lang: string
  state: SessionState
  answers?: Json
  scores?: Json
  result_snapshot?: Json
  client_token?: string
}

export interface Product extends BaseEntity {
  quiz_id: string
  active: boolean
  price_cents: number
  currency: string
  stripe_price_id?: string
  delivery_type: ProductDeliveryType
  asset_url?: string
  translations?: Json
}

export interface Order extends BaseEntity {
  quiz_id: string
  lead_id: string
  product_id: string
  amount_cents: number
  currency: string
  stripe_payment_intent?: string
  status: OrderStatus
}

export interface EmailEvent extends BaseEntity {
  lead_id: string
  template_key: string
  lang: string
  status: EmailStatus
  metadata?: Json
}

// Admin Entities
export interface AdminUser extends BaseEntity {
  email: string
  role: AdminRole
}

export interface AuditLog extends BaseEntity {
  user_id: string
  user_email: string
  action: string
  resource_type: string
  resource_id: string
  details?: Json
}

// Database schema interface
export interface Database {
  public: {
    Tables: {
      quizzes: {
        Row: Quiz
        Insert: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>
      }
      quiz_translations: {
        Row: QuizTranslation
        Insert: Omit<QuizTranslation, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuizTranslation, 'id' | 'created_at' | 'updated_at'>>
      }
      quiz_questions: {
        Row: QuizQuestion
        Insert: Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>>
      }
      quiz_scoring_rules: {
        Row: QuizScoringRule
        Insert: Omit<QuizScoringRule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuizScoringRule, 'id' | 'created_at' | 'updated_at'>>
      }
      quiz_prompts: {
        Row: QuizPrompt
        Insert: Omit<QuizPrompt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuizPrompt, 'id' | 'created_at' | 'updated_at'>>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
      }
      sessions: {
        Row: Session
        Insert: Omit<Session, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>
      }
      email_events: {
        Row: EmailEvent
        Insert: Omit<EmailEvent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EmailEvent, 'id' | 'created_at' | 'updated_at'>>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_viewer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_client_token: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
    }
    Enums: {
      quiz_status: QuizStatus
      question_type: QuestionType
      scoring_rule_type: ScoringRuleType
      session_state: SessionState
      product_delivery_type: ProductDeliveryType
      order_status: OrderStatus
      email_status: EmailStatus
      admin_role: AdminRole
    }
  }
}
