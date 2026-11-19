# SkillSync – REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP header:
`Authorization: Bearer <jwt_token>`

---

## 1. Authentication Endpoints

### `POST /auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@skillsync.com",
  "password": "Admin@123456"
}
```
- **Success (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "email": "admin@skillsync.com", "name": "System Admin", "role": "Admin" }
  }
}
```

### `GET /auth/me`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns the authenticated user session details.

---

## 2. Dashboard Analytics Endpoints

### `GET /dashboard/stats`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 12,
    "activeJobs": 5,
    "totalApplications": 18,
    "statusCounts": {
      "applied": 8,
      "screening": 4,
      "interview": 3,
      "offered": 2,
      "rejected": 1
    }
  }
}
```

---

## 3. Job Management Endpoints

### `GET /jobs`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:** `status` (optional: `active` | `deactivated`)
- **Success (200 OK):** Returns array of all matching job records.

### `GET /jobs/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns single job by its MongoDB ID.

### `POST /jobs`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "description": "Building modern interfaces using React and TypeScript.",
  "requiredSkills": ["React", "TypeScript", "Tailwind CSS"],
  "experienceMin": 3,
  "experienceMax": 6,
  "status": "active"
}
```
- **Success (201 Created):** Returns created job document.

### `PUT /jobs/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns updated job document.

### `PATCH /jobs/:id/deactivate`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns job with `status` updated to `deactivated`.

---

## 4. Candidate Management Endpoints

### `GET /candidates`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:** `search`, `skill`, `page`, `limit`
- **Success (200 OK):** Returns paginated candidates array and `pagination` object.

### `GET /candidates/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns candidate details, associated resume metadata, and applications.

### `POST /candidates`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Request Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@example.com",
  "phone": "+1-555-0199",
  "skills": ["React", "TypeScript", "Node.js"],
  "experienceYears": 4
}
```
- **Success (201 Created):** Returns created candidate document.

### `PUT /candidates/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns updated candidate document.

### `DELETE /candidates/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Deletes candidate and automatically deletes associated resume file and applications.

### `POST /candidates/:id/resume`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Content-Type:** `multipart/form-data`
- **Field:** `resume` (PDF file, max 10MB)
- **Success (200 OK):** Returns uploaded resume metadata and parsed text summary.

---

## 5. Application Management Endpoints

### `GET /applications`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:** `status`, `jobId`, `candidateId`
- **Success (200 OK):** Returns array of populated applications.

### `GET /applications/:id`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns application with populated candidate and job documents.

### `POST /applications`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Request Body:**
```json
{
  "candidateId": "6afdcbe5b4a8509fa364bd48",
  "jobId": "6afdc8e6aacff30c3f3c2dc9",
  "status": "applied"
}
```
- **Success (201 Created):** Returns created application.
- **Error (400 Bad Request):** If application is a duplicate for the candidate & job.

### `PATCH /applications/:id/status`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Request Body:** `{ "status": "screening" }`
- **Success (200 OK):** Returns application with updated status.

---

## 6. AI Screening & Interview Question Endpoints

### `POST /screening/:applicationId/screen`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Triggers Gemini to analyze resume against job requirements and stores result in `ScreeningResult`.

### `GET /screening/:applicationId/result`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns existing screening result for the application.

### `POST /screening/:applicationId/questions`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Triggers Gemini to generate tailored questions and stores them in `InterviewQuestion`.

### `GET /screening/:applicationId/questions`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns generated interview questions for the application.
