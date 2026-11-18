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
   ├── Input Validation
   └── Feature Modules & Controllers
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[ MongoDB Database ]          [ Google Gemini API ]
(User, Job, Candidate,        (Screening, Matching,
 Application, Resume,          Interview Questions)
 ScreeningResult,
 InterviewQuestion)
```

## Phase 1 Implementation Architecture

### 1. Backend Layer (Express.js + TypeScript)
- **Port:** 5000 (configurable via `PORT`)
- **Database Connector:** `src/config/database.ts` (Mongoose connection to MongoDB)
- **Authentication Service:** `src/services/auth.service.ts`
  - Validates user credentials with `bcrypt.compare`
  - Generates signed JWTs containing `userId` and `role`
- **Security & Authorization Middleware:**
  - `authenticate` in `src/middleware/auth.middleware.ts`: Validates JWT token from `Authorization: Bearer <token>`
  - `authorize(...roles)` in `src/middleware/role.middleware.ts`: Enforces role-based permissions (`Admin`, `Recruiter`)
  - `validateLoginInput` in `src/middleware/validation.middleware.ts`: Sanitizes and validates login payload
- **Routes:**
  - `POST /api/auth/login`: Public login endpoint for Admin and Recruiter
  - `GET /api/auth/me`: Protected route returning active authenticated user identity
  - `GET /api/protected/authenticated`: Verifies general token authentication
  - `GET /api/protected/admin-only`: Verifies Admin role enforcement
  - `GET /api/protected/recruiter-only`: Verifies Recruiter role enforcement

### 2. Frontend Layer (Next.js 14 + React + TypeScript + Tailwind CSS)
- **Port:** 3000
- **App Router:** `src/app`
  - `/login`: Clean login page with credentials validation and quick testing buttons
  - `/dashboard`: Protected landing page verifying session and role permissions
  - `/`: Automatic redirect to `/dashboard` if authenticated, `/login` otherwise
- **State & Service Layer:**
  - `useAuth`: React hook handling session lifecycle, login, and logout
  - `ApiService`: Centralized typed fetch client that automatically attaches the Bearer token
  - `ProtectedRoute`: Route guard component redirecting unauthenticated users and blocking unauthorized roles
