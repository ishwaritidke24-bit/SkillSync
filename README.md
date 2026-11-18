# SkillSync – AI-Powered Recruitment Management Platform

SkillSync helps recruiters and administrators manage jobs, candidates, resumes, and applications in one unified platform, enhanced with AI-assisted resume screening and interview question generation powered by Google Gemini.

---

## Technology Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** JWT + bcrypt password hashing
- **PDF Processing:** `pdf-parse` + `multer`
- **AI Engine:** Google Gemini API (`@google/genai`)

---

## Completed Phases

- **Phase 1:** Project Setup, Database Connection, Authentication & Role-Based Authorization (`Admin`, `Recruiter`).
- **Phase 2:** Job Management (Job model, REST CRUD APIs, validation, deactivation, and Next.js frontend pages).
- **Phase 3:** Candidate, Resume & Application Management (Candidate CRUD, PDF resume upload and text extraction with `pdf-parse`, private file storage, job applications linking candidates with jobs).
- **Phase 4:** AI Resume Screening and Interview Question Generation (Google Gemini API integration, prompt safeguards, `ScreeningResult` & `InterviewQuestion` collections, application review interface).

---

## Environment Variables Configuration

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=skillsync_jwt_super_secret_key_development_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Frontend (`frontend/.env.local`)
Copy `frontend/.env.example` to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run build

# Seed initial Admin and Recruiter accounts (one-time):
npx tsx src/utils/seed.ts

# Start backend server:
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Next.js frontend application runs on `http://localhost:3000`.

---

## Testing Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@skillsync.com` | `Admin@123456` |
| **Recruiter** | `recruiter@skillsync.com` | `Recruiter@123456` |
