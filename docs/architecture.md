# SkillSync – Architecture

## System Overview

SkillSync is an AI-powered recruitment management platform designed to assist recruiters and administrators with managing jobs, candidates, resumes, and applications.

## High-Level Architecture Flow

```
[ Next.js Frontend (React + TypeScript + Tailwind CSS) ]
                        │
                        ▼ (HTTP REST API / JSON + Bearer JWT)
[ Express.js Backend (TypeScript) ]
   ├── Authentication & Role Middleware
   ├── Input Validation Middleware
   ├── Feature Modules & Controllers:
   │     ├── /api/auth (Login, User identity)
   │     └── /api/jobs (Job creation, retrieval, updates, deactivation)
   └── Services Layer (AuthService, JobService)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[ MongoDB Database ]          [ Google Gemini API ]
(User, Job, Candidate,        (Screening, Matching,
 Application, Resume,          Interview Questions)
 ScreeningResult,
 InterviewQuestion)
```

## Implemented Architecture (Phases 1 & 2)

### 1. Backend Layer (Express.js + TypeScript)
- **Port:** 5000 (configurable via `PORT`)
- **Database Connection:** `src/config/database.ts` (Mongoose connection to MongoDB)
- **Middleware:**
  - `authenticate`: Validates JWT token from `Authorization: Bearer <token>`.
  - `authorize(...roles)`: Enforces role permissions (`Admin`, `Recruiter`).
  - `validateLoginInput`: Sanitizes and validates login credentials.
  - `validateJobInput`: Validates job creation payload (title, description, requiredSkills, experience range, status).
  - `validateJobUpdateInput`: Validates optional update fields.
  - `validateMongoId`: Ensures valid MongoDB ObjectId format for parameter routes.
- **Modules & Routes:**
  - **Auth (`/api/auth`):**
    - `POST /api/auth/login`: Authenticates Admin or Recruiter.
    - `GET /api/auth/me`: Returns current user session.
  - **Jobs (`/api/jobs`):**
    - `GET /api/jobs`: Retrieves all jobs (with optional status query filter).
    - `GET /api/jobs/:id`: Retrieves individual job details.
    - `POST /api/jobs`: Creates a new job posting.
    - `PUT /api/jobs/:id`: Updates an existing job.
    - `PATCH /api/jobs/:id/deactivate`: Deactivates a job posting.

### 2. Frontend Layer (Next.js 14 + React + TypeScript + Tailwind CSS)
- **Port:** 3000
- **App Router (`src/app`):**
  - `/login`: Clean login page with test credential quick-fill.
  - `/dashboard`: Protected dashboard with user session metrics, role verification, and quick links to recent jobs.
  - `/jobs`: Job listing page with status filter (`all`, `active`, `deactivated`), job cards, and action buttons.
  - `/jobs/create`: Create job form with real-time validation and error/success alerts.
  - `/jobs/[id]`: Job details view displaying title, description, skills badges, experience range, and status.
  - `/jobs/[id]/edit`: Form pre-populated with existing job details for updating.
- **Shared Components & Services:**
  - `Navbar`: Global navigation header displaying active routes, user name, and role.
  - `JobForm`: Reusable job creation/edit form component.
  - `ProtectedRoute`: Route guard component ensuring authenticated access.
  - `ApiService`: Typed HTTP client managing Bearer token transmission.
