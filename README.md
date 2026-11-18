# SkillSync – AI-Powered Recruitment Management Platform

SkillSync helps recruiters and administrators manage jobs, candidates, resumes, and applications in one unified platform, enhanced with AI-assisted resume screening and interview question generation powered by Google Gemini.

---

## Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT + bcrypt password hashing
- **AI Engine (Phase 4):** Google Gemini API
- **PDF Processing (Phase 3):** Text extraction library

---

## Folder Structure

```
SkillSync/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── lib/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   └── api-documentation.md
│
├── README.md
└── .gitignore
```

---

## Completed Phases

- **Phase 1:** Project Setup, Database Connection, Authentication, Role-Based Access Control (`Admin`, `Recruiter`).
- **Phase 2:** Job Management (Job model, REST CRUD APIs, validation, deactivation, and Next.js frontend pages for job listing, creation, editing, and details).

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
```

### Frontend (`frontend/.env.local`)
Copy `frontend/.env.example` to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running Locally

### 1. Backend Setup & Seed
```bash
cd backend
npm install
npm run build

# Seed initial Admin and Recruiter accounts:
npx tsx src/utils/seed.ts

# Start backend server:
npm run dev
# or for production: npm start
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
