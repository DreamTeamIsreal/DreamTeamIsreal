-- DreamTeamIsrael Database Schema
-- This schema supports the real vs fake data obfuscation mechanism

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (stores encrypted personal data)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    israel_id TEXT NOT NULL, -- Encrypted
    full_name TEXT NOT NULL, -- Encrypted
    date_of_birth TEXT NOT NULL, -- Encrypted
    mobile_phone_number TEXT NOT NULL, -- Encrypted
    email TEXT NOT NULL, -- Encrypted
    city TEXT NOT NULL, -- Encrypted
    password_hash TEXT NOT NULL,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    roles TEXT[] DEFAULT ARRAY['voter'],
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL -- Critical: For real vs fake identification
);

-- Candidates table (linked to users, stores encrypted candidate-specific data)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    candidacy_type VARCHAR(20) NOT NULL CHECK (candidacy_type IN ('Minister', 'Knesset Committee')),
    profile_image_url TEXT,
    full_name TEXT NOT NULL, -- May differ from user's name
    desired_position TEXT, -- For Ministers (1 of 18)
    desired_committee TEXT, -- For Knesset (1 of 15)
    professional_experience TEXT NOT NULL, -- Encrypted
    education TEXT, -- Encrypted
    personal_vision TEXT, -- Encrypted
    
    -- Documents (S3 URLs)
    police_record_url TEXT,
    wealth_declaration_url TEXT,
    conflict_of_interest_url TEXT,
    cv_url TEXT,
    
    -- Work Plans (encrypted)
    five_year_plan TEXT,
    long_term_vision_2048 TEXT,
    detailed_annual_plan TEXT,
    vision_and_work_plan_in_committee TEXT,
    
    introduction_video_link TEXT,
    additional_debate_question TEXT, -- Encrypted
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    number_of_votes INTEGER DEFAULT 0,
    number_of_supporters INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL -- Critical: For real vs fake identification
);

-- Quiz Questions (100 questions for matching)
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    order_index INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Answers (anonymized user responses)
CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_hash_id TEXT NOT NULL, -- Anonymized user identifier
    question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer INTEGER NOT NULL CHECK (answer >= 1 AND answer <= 5), -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL -- Critical: For real vs fake identification
);

-- Supporters (anonymized user-candidate relationships)
CREATE TABLE supporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_hash_id TEXT NOT NULL, -- Anonymized user identifier
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL, -- Critical: For real vs fake identification
    UNIQUE(user_hash_id, candidate_id) -- Prevent duplicate support
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL, -- Encrypted
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL -- Critical: For real vs fake identification
);

-- Dream Team Selections (user's personal dream team)
CREATE TABLE dream_team_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_hash_id TEXT NOT NULL, -- Anonymized user identifier
    position_id TEXT NOT NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    selection_type VARCHAR(20) NOT NULL CHECK (selection_type IN ('minister', 'committee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata_tag TEXT NOT NULL, -- Critical: For real vs fake identification
    UNIQUE(user_hash_id, position_id, selection_type) -- One selection per position per user
);

-- Positions (18 Minister positions + 15 Committee positions)
CREATE TABLE positions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('minister', 'committee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (critical for large datasets with fake data)
CREATE INDEX idx_users_email_hash ON users USING HASH (email);
CREATE INDEX idx_users_metadata_tag ON users (metadata_tag);
CREATE INDEX idx_users_roles ON users USING GIN (roles);

CREATE INDEX idx_candidates_user_id ON candidates (user_id);
CREATE INDEX idx_candidates_status ON candidates (status);
CREATE INDEX idx_candidates_desired_position ON candidates (desired_position);
CREATE INDEX idx_candidates_desired_committee ON candidates (desired_committee);
CREATE INDEX idx_candidates_metadata_tag ON candidates (metadata_tag);
CREATE INDEX idx_candidates_votes ON candidates (number_of_votes DESC);
CREATE INDEX idx_candidates_supporters ON candidates (number_of_supporters DESC);

CREATE INDEX idx_quiz_answers_user_hash ON quiz_answers (user_hash_id);
CREATE INDEX idx_quiz_answers_question_id ON quiz_answers (question_id);
CREATE INDEX idx_quiz_answers_metadata_tag ON quiz_answers (metadata_tag);

CREATE INDEX idx_supporters_user_hash ON supporters (user_hash_id);
CREATE INDEX idx_supporters_candidate_id ON supporters (candidate_id);
CREATE INDEX idx_supporters_metadata_tag ON supporters (metadata_tag);

CREATE INDEX idx_newsletter_metadata_tag ON newsletter_subscribers (metadata_tag);

CREATE INDEX idx_dream_team_user_hash ON dream_team_selections (user_hash_id);
CREATE INDEX idx_dream_team_position_id ON dream_team_selections (position_id);
CREATE INDEX idx_dream_team_metadata_tag ON dream_team_selections (metadata_tag);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dream_team_updated_at BEFORE UPDATE ON dream_team_selections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();