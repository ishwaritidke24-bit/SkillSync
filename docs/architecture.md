# SkillSync – Architecture

## System Overview

SkillSync is an AI-powered recruitment management platform designed to assist recruiters and administrators with managing jobs, candidates, resumes, and applications.

## High-Level Architecture Flow

```
[ Next.js Frontend (React + TypeScript + Tailwind CSS) ]
                        │
                        ▼ (HTTP REST API / JSON + Bearer JWT + Multipart/Form-Data)
[ Express.js Backend (TypeScript) ]
   ├── Authentication & Role Middleware (JWT + bcrypt)
   ├── File Upload & Text Extraction (Multer + pdf-parse)
   ├── Validation Middleware
   ├── Feature Modules & Controllers:
   │     ├── /api/auth (Login, User session)
   │     ├── /api/jobs (Job creation, updates, deactivation)
   │     ├── /api/candidates (Candidate CRUD, resume PDF upload/parsing)
   │     ├── /api/applications (Job applications linking candidate and job)
   │     └── /api/screening (AI resume screening & interview question generation)
   └── Services Layer:
         ├── AuthService
         ├── JobService
         ├── CandidateService
         ├── ApplicationService
         ├── ScreeningService
         └── GeminiService (@google/genai)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[ MongoDB Database ]          [ Google Gemini API ]
(User, Job, Candidate,        (Screening, Matching,
 Resume, Application,          Interview Questions)
 ScreeningResult,
 InterviewQuestion)
```

## Implemented Architecture (Phases 1, 2, 3 & 4)

### 1. Backend Layer (Express.js + TypeScript)
- **Port:** 5000 (configurable via `PORT`)
- **Database Connection:** `src/config/database.ts` (Mongoose connection to MongoDB Atlas)
- **Private Storage:** `backend/uploads/resumes/` stores uploaded PDF resumes securely.
- **AI Integration (`@google/genai`):**
  - Configured through backend environment variable `GEMINI_API_KEY`.
  - Prompts enforce strict guardrails: resume text is treated as untrusted data; embedded instructions are ignored; only explicitly verified skills are matched.
  - JSON Schema enforcement guarantees structured responses without hallucinations.
- **Middleware:**
  - `authenticate`: Validates JWT token from `Authorization: Bearer <token>`.
  - `authorize(...roles)`: Enforces role permissions (`Admin`, `Recruiter`).
  - `resumeUpload`: Multer middleware enforcing 10MB file-size limit and validating PDF mime-type.
  - `validateMongoId`: Ensures valid MongoDB ObjectId format.

### 2. Frontend Layer (Next.js 14 + React + TypeScript + Tailwind CSS)
- **Port:** 3000
- **App Router (`src/app`):**
  - `/login`: Clean login page with test credential quick-fill.
  - `/dashboard`: Protected dashboard with user session metrics and quick links.
  - `/jobs`: Job listing, create, edit, view, and deactivation.
  - `/candidates`: Candidate listing with search, skill filtering, pagination, and resume attachment indicators.
  - `/candidates/add`: Form to add new candidate contact info, skills, and experience.
  - `/candidates/[id]`: Candidate profile displaying details, parsed resume content, and associated applications.
  - `/applications`: Application management view to link candidates with jobs and update statuses.
  - `/applications/[id]`: Complete application review view offering one-click AI Resume Screening and Interview Question generation with comprehensive structured visual feedback.
