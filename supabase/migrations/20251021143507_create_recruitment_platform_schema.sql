/*
  # AI & Blockchain Powered Smart Recruitment Platform - Database Schema

  ## Overview
  This migration creates the complete database schema for the recruitment platform including
  user management, document verification, job matching, and interview preparation.

  ## New Tables

  ### 1. profiles
  Extended user profile information for both candidates and recruiters
  - `id` (uuid, references auth.users) - User ID from Supabase Auth
  - `user_type` (text) - Either 'candidate' or 'recruiter'
  - `full_name` (text) - User's full name
  - `email` (text) - User's email address
  - `phone` (text) - Contact phone number
  - `location` (text) - User location
  - `company_name` (text) - For recruiters only
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. candidate_profiles
  Additional information specific to candidates
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - Link to user profile
  - `skills` (text array) - List of candidate skills
  - `experience_years` (integer) - Years of experience
  - `education` (text) - Educational background
  - `bio` (text) - Candidate biography
  - `resume_url` (text) - URL to uploaded resume
  - `verification_status` (text) - Status: verified, pending, fraudulent
  - `skill_gap_analysis` (jsonb) - AI-generated skill gap data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. certificates
  Store and verify candidate certificates
  - `id` (uuid, primary key)
  - `candidate_id` (uuid, references candidate_profiles)
  - `certificate_name` (text) - Name of certificate
  - `issuing_organization` (text) - Who issued it
  - `issue_date` (date) - When it was issued
  - `certificate_url` (text) - URL to certificate document
  - `blockchain_hash` (text) - Blockchain verification hash
  - `verification_status` (text) - verified, pending, fraudulent
  - `created_at` (timestamptz)

  ### 4. jobs
  Job postings created by recruiters
  - `id` (uuid, primary key)
  - `recruiter_id` (uuid, references profiles)
  - `title` (text) - Job title
  - `description` (text) - Job description
  - `required_skills` (text array) - Required skills
  - `location` (text) - Job location
  - `salary_min` (integer) - Minimum salary
  - `salary_max` (integer) - Maximum salary
  - `experience_required` (integer) - Years of experience needed
  - `status` (text) - active, closed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. job_applications
  Track candidate applications to jobs
  - `id` (uuid, primary key)
  - `job_id` (uuid, references jobs)
  - `candidate_id` (uuid, references candidate_profiles)
  - `status` (text) - applied, reviewing, shortlisted, rejected, hired
  - `ai_match_score` (integer) - AI-calculated match score (0-100)
  - `cover_letter` (text) - Application cover letter
  - `applied_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. interview_questions
  AI-generated interview questions for practice
  - `id` (uuid, primary key)
  - `candidate_id` (uuid, references candidate_profiles)
  - `job_role` (text) - Target job role
  - `question` (text) - The interview question
  - `answer_hints` (text) - Hints for answering
  - `difficulty` (text) - easy, medium, hard
  - `created_at` (timestamptz)

  ### 7. interview_sessions
  Track mock interview practice sessions
  - `id` (uuid, primary key)
  - `candidate_id` (uuid, references candidate_profiles)
  - `session_data` (jsonb) - Questions and answers from session
  - `feedback` (text) - AI-generated feedback
  - `score` (integer) - Performance score (0-100)
  - `created_at` (timestamptz)

  ### 8. learning_recommendations
  AI-suggested courses and resources
  - `id` (uuid, primary key)
  - `candidate_id` (uuid, references candidate_profiles)
  - `course_name` (text) - Name of recommended course
  - `platform` (text) - Learning platform (Coursera, Udemy, etc.)
  - `url` (text) - Link to course
  - `skill_target` (text) - Which skill this addresses
  - `priority` (text) - high, medium, low
  - `created_at` (timestamptz)

  ### 9. fraud_reports
  Track fraud detection events
  - `id` (uuid, primary key)
  - `candidate_id` (uuid, references candidate_profiles)
  - `document_type` (text) - Type of document (resume, certificate)
  - `document_id` (uuid) - Reference to the document
  - `fraud_indicators` (jsonb) - AI-detected fraud signals
  - `severity` (text) - low, medium, high
  - `status` (text) - under_review, confirmed, false_positive
  - `created_at` (timestamptz)

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Candidates can only view/edit their own data
  - Recruiters can view verified candidate data and manage their own job postings
  - Admin users have full access (handled via custom claims)

  ## Important Notes
  1. All user authentication is handled by Supabase Auth
  2. Blockchain hashes are stored as text references
  3. AI-generated data is stored in JSONB format for flexibility
  4. All tables use UUIDs for primary keys
  5. Timestamps are in UTC timezone
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('candidate', 'recruiter', 'admin')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  company_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidate_profiles table
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  education text,
  bio text,
  resume_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'fraudulent')),
  skill_gap_analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  certificate_name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  certificate_url text NOT NULL,
  blockchain_hash text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'fraudulent')),
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  location text,
  salary_min integer,
  salary_max integer,
  experience_required integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  ai_match_score integer DEFAULT 0 CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
  cover_letter text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_role text NOT NULL,
  question text NOT NULL,
  answer_hints text,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now()
);

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  session_data jsonb DEFAULT '{}',
  feedback text,
  score integer CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create learning_recommendations table
CREATE TABLE IF NOT EXISTS learning_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  platform text,
  url text,
  skill_target text,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at timestamptz DEFAULT now()
);

-- Create fraud_reports table
CREATE TABLE IF NOT EXISTS fraud_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_id uuid,
  fraud_indicators jsonb DEFAULT '{}',
  severity text DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
  status text DEFAULT 'under_review' CHECK (status IN ('under_review', 'confirmed', 'false_positive')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for candidate_profiles
CREATE POLICY "Candidates can view own profile"
  ON candidate_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Recruiters can view verified candidates"
  ON candidate_profiles FOR SELECT
  TO authenticated
  USING (
    verification_status = 'verified' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'recruiter'
    )
  );

CREATE POLICY "Candidates can update own profile"
  ON candidate_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Candidates can insert own profile"
  ON candidate_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for certificates
CREATE POLICY "Candidates can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update own certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can delete own certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Recruiters can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    recruiter_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'recruiter'
    )
  );

CREATE POLICY "Recruiters can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (recruiter_id = auth.uid())
  WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (recruiter_id = auth.uid());

-- RLS Policies for job_applications
CREATE POLICY "Candidates can view own applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can view applications for their jobs"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own applications"
  ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update applications for their jobs"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    job_id IN (
      SELECT id FROM jobs WHERE recruiter_id = auth.uid()
    )
  );

-- RLS Policies for interview_questions
CREATE POLICY "Candidates can view own interview questions"
  ON interview_questions FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert interview questions"
  ON interview_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for interview_sessions
CREATE POLICY "Candidates can view own interview sessions"
  ON interview_sessions FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own interview sessions"
  ON interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for learning_recommendations
CREATE POLICY "Candidates can view own learning recommendations"
  ON learning_recommendations FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert learning recommendations"
  ON learning_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for fraud_reports
CREATE POLICY "Recruiters can view fraud reports"
  ON fraud_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('recruiter', 'admin')
    )
  );

CREATE POLICY "System can insert fraud reports"
  ON fraud_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('recruiter', 'admin')
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_verification ON candidate_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_certificates_candidate_id ON certificates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_candidate_id ON interview_questions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_candidate_id ON interview_sessions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_candidate_id ON learning_recommendations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_candidate_id ON fraud_reports(candidate_id);