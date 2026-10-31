CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(100) NOT NULL,
 email VARCHAR(180) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 role VARCHAR(20) NOT NULL CHECK(role IN ('student','recruiter','admin')),
 headline VARCHAR(160),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS internships (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 recruiter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title VARCHAR(160) NOT NULL,
 company VARCHAR(120) NOT NULL,
 category VARCHAR(80) NOT NULL,
 location VARCHAR(120) NOT NULL,
 work_mode VARCHAR(10) NOT NULL CHECK(work_mode IN ('remote','hybrid','onsite')),
 type VARCHAR(20) NOT NULL DEFAULT 'internship',
 description TEXT NOT NULL,
 requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
 stipend NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK(stipend>=0),
 currency CHAR(3) NOT NULL DEFAULT 'INR',
 duration VARCHAR(80) NOT NULL DEFAULT 'Not specified',
 application_url TEXT,
 deadline DATE,
 status VARCHAR(10) NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed','draft')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS applications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
 cover_letter VARCHAR(2500) DEFAULT '',
 status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','reviewing','shortlisted','rejected','accepted')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(student_id,internship_id)
);
CREATE TABLE IF NOT EXISTS bookmarks (
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 PRIMARY KEY(user_id,internship_id)
);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON internships(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON internships(category);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON internships(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id,created_at DESC);
