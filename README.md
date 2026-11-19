# SkillSync – AI-Powered Recruitment Management Platform

SkillSync helps recruiters and administrators manage jobs, candidates, resumes, and applications in one unified platform, enhanced with AI-assisted resume screening and interview question generation powered by Google Gemini.

---

## Key Features

1. **Role-Based Authentication:** Secure JWT authentication and bcrypt password hashing with dedicated `Admin` and `Recruiter` roles.
2. **Job Management:** Post, view, edit, filter, and deactivate positions with required skills and experience thresholds.
3. **Candidate Management:** Comprehensive candidate profiles with search, skill filtering, pagination, and resume attachment indicators.
4. **Resume Processing:** Upload and validate PDF resumes; extracts text using `pdf-parse` and stores files securely in private server storage.
5. **Application Management:** Track candidate submissions per job with independent pipeline statuses (`applied`, `screening`, `interview`, `offered`, `rejected`).
6. **AI Resume Screening:** Google Gemini analyzes extracted resume text against job requirements to evaluate matching skills, missing skills, and experience alignments.
7. **Interview Question Generation:** Generates relevant, non-generic technical and behavioral interview questions tailored to the candidate's verified resume and job requirements.
8. **Recruitment Analytics Dashboard:** Live dashboard providing instant metrics on total candidates, active jobs, total applications, and status counts.

---

## Technology Stack

| Area | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Authentication** | JWT + bcrypt |
| **PDF Processing**| Multer (upload validation) + pdf-parse (text extraction) |
| **AI Integration** | Google Gemini API (`@google/genai`, model: `gemini-2.5-flash`) |

---

## Folder Structure

```
SkillSync/
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── applications/    # Application management & AI review
│   │   │   ├── candidates/      # Candidate directory & profiles
│   │   │   ├── dashboard/       # Recruitment dashboard analytics
│   │   │   ├── jobs/            # Job management (create, edit, view)
│   │   │   └── login/           # Authentication page
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # Frontend API client
│   │   ├── hooks/               # Custom React hooks (useAuth)
│   │   ├── types/               # TypeScript interfaces
│   │   └── lib/                 # Frontend utilities
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── middleware/          # Auth, role, upload, & validation middleware
│   │   ├── models/              # Mongoose data models
│   │   ├── modules/             # Controllers and routes
│   │   ├── services/            # Business & AI services
│   │   ├── utils/               # JWT, PDF extraction, & seed utilities
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Server entry point
│   │
│   └── package.json
│
├── docs/
│   ├── architecture.md          # Architecture & data flow
│   ├── database-schema.md       # MongoDB collections documentation
│   └── api-documentation.md     # REST API documentation
│
├── README.md
└── .gitignore
```

---

## Prerequisites

- **Node.js:** v18.x, v20.x, or v22.x
- **MongoDB Atlas:** MongoDB connection string
- **Google Gemini API Key:** For AI resume screening and question generation

---

## Environment Variables Configuration

### Backend (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Frontend (`frontend/.env.local`)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Local Setup & Running Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run build

# Seed default Admin and Recruiter accounts (one-time setup):
npx tsx src/utils/seed.ts

# Start development server:
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

---

## Default Testing Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@skillsync.com` | `Admin@123456` |
| **Recruiter** | `recruiter@skillsync.com` | `Recruiter@123456` |

---

## Suggested Demo Video Walkthrough Sequence

1. **Authentication:** Sign in with `recruiter@skillsync.com` / `Recruiter@123456`.
2. **Dashboard Overview:** View live statistics (total candidates, active jobs, applications, and status counts).
3. **Job Management:** Post a new job (e.g., "Full Stack Developer" with skills React, TypeScript, Node.js, MongoDB).
4. **Candidate Management:** Add a candidate profile with skills and experience.
5. **Resume Upload:** Upload a sample PDF resume and view the extracted text preview.
6. **Application Linking:** Link the candidate to the active job.
7. **AI Screening:** Click **"Review & AI Screen"** -> **"Screen Resume with AI"** to see matching skills, missing skills, and recruiter explanations generated by Gemini.
8. **Interview Questions:** Click **"Generate Interview Questions"** to view tailored technical and behavioral questions.
9. **Status Pipeline Update:** Update status from `applied` to `interview` and return to the Dashboard to confirm the live counter updates.

---

## Deployment Preparation

- **Backend:** Ready for deployment to platforms supporting Node.js (e.g. Render, Railway, Fly.io, or AWS ECS). Set `NODE_ENV=production`, configure environment variables, and run `npm run build && npm start`.
- **Frontend:** Ready for deployment to Vercel, Netlify, or any Node.js hosting platform. Run `npm run build && npm start` with `NEXT_PUBLIC_API_URL` pointing to the deployed backend URL.
- **CORS:** The backend CORS configuration dynamically accepts the origin configured via the `CLIENT_URL` environment variable.
