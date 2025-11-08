/*
  # HealthSync Medical Platform Database Schema

  ## Overview
  This migration creates the complete database structure for the HealthSync medical platform
  with three user roles: Admin, Doctor, and Patient.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'admin', 'doctor', or 'patient'
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. doctors
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles.id
  - `specialization` (text) - Medical specialization
  - `license_number` (text) - Medical license number
  - `experience_years` (integer) - Years of experience
  - `consultation_fee` (numeric) - Fee per consultation
  - `bio` (text) - Professional biography
  - `available_days` (text array) - Days available for consultation
  - `available_hours` (text) - Working hours
  - `status` (text) - 'active' or 'inactive'

  ### 3. patients
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles.id
  - `date_of_birth` (date) - Patient's birth date
  - `gender` (text) - Patient's gender
  - `blood_type` (text) - Blood type
  - `phone` (text) - Contact number
  - `address` (text) - Residential address
  - `emergency_contact` (text) - Emergency contact details
  - `medical_history` (text) - Medical history notes

  ### 4. appointments
  - `id` (uuid, primary key)
  - `patient_id` (uuid) - References patients.id
  - `doctor_id` (uuid) - References doctors.id
  - `appointment_date` (date) - Appointment date
  - `appointment_time` (text) - Appointment time slot
  - `status` (text) - 'scheduled', 'completed', 'cancelled'
  - `reason` (text) - Reason for visit
  - `notes` (text) - Doctor's notes
  - `created_at` (timestamptz)

  ### 5. medical_records
  - `id` (uuid, primary key)
  - `patient_id` (uuid) - References patients.id
  - `doctor_id` (uuid) - References doctors.id
  - `record_type` (text) - 'prescription', 'lab_report', 'imaging', 'other'
  - `title` (text) - Record title
  - `description` (text) - Record description
  - `file_url` (text) - File storage URL
  - `created_at` (timestamptz)

  ### 6. diagnoses
  - `id` (uuid, primary key)
  - `patient_id` (uuid) - References patients.id
  - `symptoms` (text array) - List of symptoms
  - `ai_prediction` (jsonb) - AI diagnosis results with confidence scores
  - `doctor_diagnosis` (text) - Doctor's actual diagnosis
  - `created_at` (timestamptz)

  ### 7. system_analytics
  - `id` (uuid, primary key)
  - `metric_type` (text) - Type of metric
  - `metric_value` (numeric) - Value
  - `metadata` (jsonb) - Additional data
  - `recorded_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for role-based access control
  - Users can only access their own data
  - Doctors can view assigned patients
  - Admins have full access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  license_number text UNIQUE NOT NULL,
  experience_years integer DEFAULT 0,
  consultation_fee numeric(10,2) DEFAULT 0,
  bio text,
  available_days text[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_hours text DEFAULT '09:00-17:00',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  blood_type text,
  phone text,
  address text,
  emergency_contact text,
  medical_history text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  reason text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  record_type text NOT NULL CHECK (record_type IN ('prescription', 'lab_report', 'imaging', 'other')),
  title text NOT NULL,
  description text,
  file_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  symptoms text[] NOT NULL,
  ai_prediction jsonb,
  doctor_diagnosis text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create system_analytics table
CREATE TABLE IF NOT EXISTS system_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  metric_value numeric,
  metadata jsonb,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE system_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for doctors
CREATE POLICY "Anyone can view active doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (
    user_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage doctors"
  ON doctors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for patients
CREATE POLICY "Patients can view own data"
  ON patients FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Patients can insert own data"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can view their patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = patients.id
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can cancel own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for medical_records
CREATE POLICY "Patients can view own records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can view their patients' records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
    OR patient_id IN (
      SELECT DISTINCT a.patient_id
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE d.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all records"
  ON medical_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for diagnoses
CREATE POLICY "Patients can view own diagnoses"
  ON diagnoses FOR SELECT
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can create diagnoses"
  ON diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can view patient diagnoses"
  ON diagnoses FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT DISTINCT a.patient_id
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE d.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update diagnoses"
  ON diagnoses FOR UPDATE
  TO authenticated
  USING (
    patient_id IN (
      SELECT DISTINCT a.patient_id
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE d.user_id = auth.uid()
    )
  );

-- RLS Policies for system_analytics
CREATE POLICY "Admins can view analytics"
  ON system_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert analytics"
  ON system_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_patient_id ON diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_system_analytics_type ON system_analytics(metric_type);