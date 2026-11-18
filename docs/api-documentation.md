# SkillSync – REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints
- `POST /auth/login` - Public login endpoint for Admin/Recruiter (returns JWT).
- `GET /auth/me` - Protected endpoint returning authenticated user profile.

---

## 2. Job Management Endpoints
- `GET /jobs` - List all jobs (supports `?status=active|deactivated`).
- `GET /jobs/:id` - Get job details by MongoDB ID.
- `POST /jobs` - Create job.
- `PUT /jobs/:id` - Update job.
- `PATCH /jobs/:id/deactivate` - Deactivate job.

---

## 3. Candidate Management Endpoints
- `GET /candidates` - List candidates (`?search=`, `?skill=`, `?page=`, `?limit=`).
- `GET /candidates/:id` - Get candidate details, resume metadata, and applications.
- `POST /candidates` - Add new candidate.
- `PUT /candidates/:id` - Update candidate details.
- `DELETE /candidates/:id` - Delete candidate (cascades to resume and applications).
- `POST /candidates/:id/resume` - Upload PDF resume, extract text, and link to candidate.

---

## 4. Application Management Endpoints
- `GET /applications` - List applications (`?status=`, `?jobId=`, `?candidateId=`).
- `GET /applications/:id` - Get application details.
- `POST /applications` - Create application linking candidate and job.
- `PATCH /applications/:id/status` - Update application status independently.

---

## 5. AI Screening & Interview Question Endpoints (Phase 4)

All AI endpoints require an authenticated user (`Admin` or `Recruiter`) via JWT Bearer token.

### `POST /screening/:applicationId/screen`
Triggers Google Gemini to analyze the candidate's extracted resume text against the job requirements.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Prerequisites:** The candidate must have an uploaded PDF resume with extracted text.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "AI resume screening completed successfully",
  "data": {
    "_id": "6afdcf5d0afe89853601086f",
    "application": "6afdcbe5b4a8509fa364bd53",
    "matchingSkills": ["React", "TypeScript", "Node.js"],
    "missingSkills": ["Docker"],
    "experienceAnalysis": "Candidate demonstrates 4 years of relevant software engineering experience, aligning well with the 3-5 year requirement.",
    "explanation": "Strong evidence of React and TypeScript frontend development. Docker experience is not explicitly mentioned.",
    "summary": "Qualified candidate with strong core skills. Candidate meets baseline experience criteria for recruiter review.",
    "createdAt": "2026-11-18T16:15:00.000Z"
  }
}
```

---

### `GET /screening/:applicationId/result`
Retrieves existing stored screening results for an application.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns the persisted `ScreeningResult` document.
- **Error (404 Not Found):** If screening has not been conducted yet.

---

### `POST /screening/:applicationId/questions`
Triggers Google Gemini to generate 5-7 tailored technical and role-specific interview questions based on the candidate's resume and job requirements.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Interview questions generated successfully",
  "data": {
    "_id": "6afdcf5d0afe898536010872",
    "application": "6afdcbe5b4a8509fa364bd53",
    "questions": [
      {
        "question": "Can you explain how you structured complex state in your recent React and TypeScript projects?",
        "category": "Technical Knowledge",
        "context": "Evaluates candidate's practical experience with required frontend tech stack"
      },
      {
        "question": "How would you design a MongoDB schema to support fast reads for a recruitment analytics dashboard?",
        "category": "Database Architecture",
        "context": "Assesses competency in MongoDB design requirements for the position"
      }
    ],
    "createdAt": "2026-11-18T16:16:00.000Z"
  }
}
```

---

### `GET /screening/:applicationId/questions`
Retrieves existing stored interview questions for an application.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns the persisted `InterviewQuestion` document.
