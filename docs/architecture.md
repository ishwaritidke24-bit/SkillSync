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
   ├── File Upload & Extraction Middleware (Multer + pdf-parse)
   ├── Input Validation Middleware
   ├── Feature Modules & Controllers:
   │     ├── /api/auth (Login, User session)
   │     ├── /api/jobs (Job creation, updates, deactivation)
   │     ├── /api/candidates (Candidate CRUD, resume PDF upload/parsing)
   │     └── /api/applications (Job applications linking candidate and job)
   └── Services Layer (AuthService, JobService, CandidateService, ApplicationService)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[ MongoDB Database ]          [ Google Gemini API ]
(User, Job, Candidate,        (Screening, Matching,
 Resume, Application,          Interview Questions)
 ScreeningResult,
 InterviewQuestion)
```

## Implemented Architecture (Phases 1, 2 & 3)

### 1. Backend Layer (Express.js + TypeScript)
- **Port:** 5000 (configurable via `PORT`)
- **Database Connection:** `src/config/database.ts` (Mongoose connection to MongoDB Atlas)
- **Private Storage:** `backend/uploads/resumes/` stores uploaded PDF resumes securely outside of public web roots.
- **Middleware:**
  - `authenticate`: Validates JWT token from `Authorization: Bearer <token>`.
  - `authorize(...roles)`: Enforces role permissions (`Admin`, `Recruiter`).
  - `resumeUpload`: Multer middleware enforcing a 10MB file-size limit and validating PDF mime-type/extension.
  - `PdfExtractor`: Validates PDF `%PDF-` file header and extracts plain text content using `pdf-parse`.
  - Validation middleware for input sanitization and MongoDB ID formats.

### 2. Frontend Layer (Next.js 14 + React + TypeScript + Tailwind CSS)
- **Port:** 3000
- **App Router (`src/app`):**
  - `/login`: Clean login page with test credential quick-fill.
  - `/dashboard`: Protected dashboard with user session metrics, role verification, and quick links.
  - `/jobs`: Job listing, create, edit, view, and deactivation.
  - `/candidates`: Candidate listing with search, skill filtering, pagination, and resume attachment indicators.
  - `/candidates/add`: Form to add new candidate contact info, skills, and experience.
  - `/candidates/[id]`: Candidate profile displaying details, parsed resume content, and associated job applications.
  - `/applications`: Application management view to link candidates with jobs, view applicant statuses, and update hiring pipeline stages.
- **Shared Components & Services:**
  - `Navbar`: Global navigation header with links to Dashboard, Jobs, Candidates, and Applications.
  - `ResumeUploadModal`: Modal for uploading PDF resumes with live file validation and feedback.
  - `CandidateForm` & `JobForm`: Reusable form components with validation.
  - `ApiService`: Typed HTTP client managing token authentication and multipart file uploads.
