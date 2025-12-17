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
      profiles: {
        Row: {
          id: string
          user_type: 'candidate' | 'recruiter' | 'admin'
          full_name: string
          email: string
          phone: string | null
          location: string | null
          company_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: 'candidate' | 'recruiter' | 'admin'
          full_name: string
          email: string
          phone?: string | null
          location?: string | null
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: 'candidate' | 'recruiter' | 'admin'
          full_name?: string
          email?: string
          phone?: string | null
          location?: string | null
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      candidate_profiles: {
        Row: {
          id: string
          user_id: string
          skills: string[]
          experience_years: number
          education: string | null
          bio: string | null
          resume_url: string | null
          verification_status: 'verified' | 'pending' | 'fraudulent'
          skill_gap_analysis: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skills?: string[]
          experience_years?: number
          education?: string | null
          bio?: string | null
          resume_url?: string | null
          verification_status?: 'verified' | 'pending' | 'fraudulent'
          skill_gap_analysis?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skills?: string[]
          experience_years?: number
          education?: string | null
          bio?: string | null
          resume_url?: string | null
          verification_status?: 'verified' | 'pending' | 'fraudulent'
          skill_gap_analysis?: Json
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          candidate_id: string
          certificate_name: string
          issuing_organization: string
          issue_date: string | null
          certificate_url: string
          blockchain_hash: string | null
          verification_status: 'verified' | 'pending' | 'fraudulent'
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          certificate_name: string
          issuing_organization: string
          issue_date?: string | null
          certificate_url: string
          blockchain_hash?: string | null
          verification_status?: 'verified' | 'pending' | 'fraudulent'
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          certificate_name?: string
          issuing_organization?: string
          issue_date?: string | null
          certificate_url?: string
          blockchain_hash?: string | null
          verification_status?: 'verified' | 'pending' | 'fraudulent'
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          description: string
          required_skills: string[]
          location: string | null
          salary_min: number | null
          salary_max: number | null
          experience_required: number
          status: 'active' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          description: string
          required_skills?: string[]
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          experience_required?: number
          status?: 'active' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          description?: string
          required_skills?: string[]
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          experience_required?: number
          status?: 'active' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          candidate_id: string
          status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
          ai_match_score: number
          cover_letter: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          candidate_id: string
          status?: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
          ai_match_score?: number
          cover_letter?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          candidate_id?: string
          status?: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
          ai_match_score?: number
          cover_letter?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      interview_questions: {
        Row: {
          id: string
          candidate_id: string
          job_role: string
          question: string
          answer_hints: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          job_role: string
          question: string
          answer_hints?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          job_role?: string
          question?: string
          answer_hints?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
      }
      interview_sessions: {
        Row: {
          id: string
          candidate_id: string
          session_data: Json
          feedback: string | null
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          session_data?: Json
          feedback?: string | null
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          session_data?: Json
          feedback?: string | null
          score?: number | null
          created_at?: string
        }
      }
      learning_recommendations: {
        Row: {
          id: string
          candidate_id: string
          course_name: string
          platform: string | null
          url: string | null
          skill_target: string | null
          priority: 'high' | 'medium' | 'low'
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          course_name: string
          platform?: string | null
          url?: string | null
          skill_target?: string | null
          priority?: 'high' | 'medium' | 'low'
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          course_name?: string
          platform?: string | null
          url?: string | null
          skill_target?: string | null
          priority?: 'high' | 'medium' | 'low'
          created_at?: string
        }
      }
      fraud_reports: {
        Row: {
          id: string
          candidate_id: string
          document_type: string
          document_id: string | null
          fraud_indicators: Json
          severity: 'low' | 'medium' | 'high'
          status: 'under_review' | 'confirmed' | 'false_positive'
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          document_type: string
          document_id?: string | null
          fraud_indicators?: Json
          severity?: 'low' | 'medium' | 'high'
          status?: 'under_review' | 'confirmed' | 'false_positive'
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          document_type?: string
          document_id?: string | null
          fraud_indicators?: Json
          severity?: 'low' | 'medium' | 'high'
          status?: 'under_review' | 'confirmed' | 'false_positive'
          created_at?: string
        }
      }
    }
  }
}
