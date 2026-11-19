# SkillSync – Architecture

## System Overview

SkillSync is an AI-powered recruitment management platform designed to assist recruiters and administrators with managing jobs, candidates, resumes, and applications. The platform integrates Google Gemini AI for objective resume screening and tailored interview question generation without automating final hiring decisions.

---

## High-Level Architecture Flow

```
[ Next.js Frontend (React 18 + Next.js 14 App Router + TypeScript + Tailwind CSS) ]
                        │
                        ▼ (HTTP REST API / JSON + Bearer JWT + Multipart/Form-Data)
[ Express.js Backend (TypeScript + Node.js) ]
   ├── Authentication & Role Authorization Middleware (JWT + bcrypt)
   ├── File Upload & Text Extraction (Multer + pdf-parse)
   ├── Validation Middleware (Input sanitization & ObjectId checks)
   ├── Feature Modules & Controllers:
   │     ├── /api/auth (Login, User session verification)
   │     ├── /api/jobs (Job creation, listing, updates, deactivation)
   │     ├── /api/candidates (Candidate CRUD, resume PDF upload/parsing)
   │     ├── /api/applications (Job applications linking candidate and job)
   │     ├── /api/screening (AI resume screening & interview question generation)
   │     └── /api/dashboard (Live recruitment metrics and pipeline counts)
   └── Services Layer:
         ├── AuthService
         ├── JobService
         ├── CandidateService
         ├── ApplicationService
         ├── ScreeningService
         ├── DashboardService
         └── GeminiService (@google/genai)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[ MongoDB Atlas Database ]    [ Google Gemini API ]
(User, Job, Candidate,        (gemini-2.5-flash with
 Resume, Application,          strict JSON Schemas for
 ScreeningResult,              objective screening &
 InterviewQuestion)            question generation)
```

---

## Implemented Layer Responsibilities

### 1. Frontend Layer (`frontend/`)
- Built with **Next.js 14 App Router**, **React 18**, **TypeScript**, and styled with **Tailwind CSS**.
- **Role-based client protection:** Components like `ProtectedRoute` ensure that unauthenticated users or users with invalid roles are redirected appropriately.
- **Centralized API Client:** `ApiService` in `frontend/src/services/api.ts` transparently manages token storage in `localStorage` and attaches the `Authorization: Bearer <token>` header to all requests.
- **App Routes:**
  - `/login`: Admin and Recruiter login with prefill test shortcuts.
  - `/dashboard`: Real-time analytics displaying candidate totals, active jobs, applications count, and pipeline status breakdown.
  - `/jobs`: Job vacancy list with status filters (`all`, `active`, `deactivated`).
  - `/jobs/create`: Job opening creation form.
  - `/jobs/[id]`: Job specification and requirement details.
  - `/jobs/[id]/edit`: Job details editing.
  - `/candidates`: Candidate directory with search, skill filtering, and pagination.
  - `/candidates/add`: Candidate onboarding form.
  - `/candidates/[id]`: Candidate profile showing details, parsed resume text, and job applications.
  - `/applications`: Application table linking candidates to jobs with inline status update dropdowns.
  - `/applications/[id]`: Review view to trigger AI Resume Screening and Interview Question generation.

### 2. Backend Layer (`backend/`)
- Built with **Express.js**, **Node.js**, and **TypeScript**.
- Modularized into `modules/`, `services/`, `models/`, `middleware/`, and `config/`.
- Private server-side storage for resumes (`backend/uploads/resumes/`) prevents exposing raw candidate resumes through public static web assets.

### 3. Database Layer (`MongoDB Atlas`)
- Seven strict MongoDB collections managed through Mongoose:
  - `User`, `Job`, `Candidate`, `Resume`, `Application`, `ScreeningResult`, `InterviewQuestion`.
- Compound unique index `{ candidate: 1, job: 1 }` prevents duplicate applications.

### 4. AI Engine (`Google Gemini`)
- Official `@google/genai` SDK using `gemini-2.5-flash`.
- Uses system instructions to treat resumes as untrusted data, forbidding prompt injection.
- Forces structured JSON output conforming to strict schemas.
- AI provides objective decision support; automatic candidate rejection is prohibited.
