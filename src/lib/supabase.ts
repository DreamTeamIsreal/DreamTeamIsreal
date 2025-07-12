import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  phone: string
  id_number: string
  full_name: string
  district_id?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface District {
  id: string
  name: string
  description?: string
  geographical_area?: string
  created_at: string
}

export interface AuthorityCharacter {
  id: string
  name: string
  description?: string
  color_class?: string
  created_at: string
}

export interface Position {
  id: string
  title: string
  description?: string
  icon?: string
  is_prime_minister: boolean
  display_order?: number
  created_at: string
}

export interface Candidate {
  id: string
  user_id: string
  position_id: string
  full_name: string
  experience: string
  education: string
  vision: string
  video_url?: string
  custom_question?: string
  status: 'pending' | 'approved' | 'rejected'
  supporters_count: number
  rating: number
  created_at: string
  updated_at: string
}

export interface CandidateDocument {
  id: string
  candidate_id: string
  document_type: 'police_record' | 'wealth_declaration' | 'conflict_of_interest' | 'cv'
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface CandidatePlan {
  id: string
  candidate_id: string
  five_year_plan: string
  vision_2048: string
  yearly_plan: string
  created_at: string
  updated_at: string
}

export interface QuestionnaireQuestion {
  id: string
  question_number: number
  category: string
  question_text: string
  created_at: string
}

export interface CandidateAnswer {
  id: string
  candidate_id: string
  question_id: string
  answer_value: number
  explanation?: string
  created_at: string
}

export interface UserAnswer {
  id: string
  user_id: string
  question_id: string
  answer_value: number
  created_at: string
}

export interface UserSelection {
  id: string
  user_id: string
  position_id: string
  candidate_id: string
  match_percentage?: number
  selected_at: string
}

export interface Vote {
  id: string
  user_id: string
  district_id: string
  authority_character_id: string
  position_votes: any
  created_at: string
}

export interface Statistics {
  id: string
  total_participants: number
  participation_percentage: number
  active_districts: number
  registered_candidates: number
  updated_at: string
}