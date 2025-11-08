import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  license_number: string;
  experience_years: number;
  consultation_fee: number;
  bio?: string;
  available_days: string[];
  available_hours: string;
  status: 'active' | 'inactive';
}

export interface Patient {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  blood_type?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  record_type: 'prescription' | 'lab_report' | 'imaging' | 'other';
  title: string;
  description?: string;
  file_url?: string;
  created_at: string;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  symptoms: string[];
  ai_prediction?: {
    disease: string;
    confidence: number;
  }[];
  doctor_diagnosis?: string;
  created_at: string;
}