# SkillSync – REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /auth/login`
- **Access:** Public
- **Body:** `{ "email": "admin@skillsync.com", "password": "Admin@123456" }`
- **Success (200 OK):** Returns JWT token and user profile.

### `GET /auth/me`
- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success (200 OK):** Returns current user information.

---

## 2. Job Management Endpoints

- `GET /jobs` - List all jobs (supports `?status=active|deactivated`)
- `GET /jobs/:id` - Get job details by MongoDB ID
- `POST /jobs` - Create job
- `PUT /jobs/:id` - Update job
- `PATCH /jobs/:id/deactivate` - Deactivate job

---

## 3. Candidate Management Endpoints

All candidate endpoints require an authenticated user (`Admin` or `Recruiter`).

### `GET /candidates`
Retrieves paginated candidates with optional search and skill filtering.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:**
  - `search` (optional): Search by name or email
  - `skill` (optional): Filter by skill keyword
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Results per page (default: 10)
- **Headers:** `Authorization: Bearer <token>`
- **Success (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6afdcbe5b4a8509fa364bd48",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1-555-0199",
      "skills": ["React", "TypeScript", "Node.js"],
      "experienceYears": 4,
      "resume": {
        "_id": "6afdcc6bdf6f19ced7e6039a",
        "fileName": "Jane_Doe_Resume.pdf",
        "fileSize": 1048576,
        "mimeType": "application/pdf"
      },
      "createdAt": "2026-11-18T16:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### `GET /candidates/:id`
Retrieves complete candidate profile, parsed resume metadata, and associated applications.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "candidate": { ... },
    "resume": {
      "_id": "...",
      "fileName": "Resume.pdf",
      "fileSize": 45020,
      "extractedText": "Extracted plain text resume content..."
    },
    "applications": [ ... ]
  }
}
```

### `POST /candidates`
Creates a new candidate record.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@example.com",
  "phone": "+1-555-0123",
  "skills": ["Python", "Docker", "Node.js"],
  "experienceYears": 3
}
```
- **Success (201 Created):** Returns created candidate document.

### `PUT /candidates/:id`
Updates candidate fields.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** Returns updated candidate document.

### `DELETE /candidates/:id`
Deletes candidate and automatically cleans up associated applications and stored resume files.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Success (200 OK):** `{ "success": true, "message": "Candidate and associated data deleted successfully" }`

### `POST /candidates/:id/resume`
Uploads a PDF resume, parses its text, and associates it with the candidate.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Content-Type:** `multipart/form-data`
- **Field:** `resume` (File, max 10MB, PDF only)
- **Success (200 OK):**
```json
{
  "success": true,
  "message": "Resume uploaded and processed successfully",
  "data": {
    "_id": "6afdcc6bdf6f19ced7e6039a",
    "fileName": "Alex_Morgan_Resume.pdf",
    "fileSize": 45020,
    "mimeType": "application/pdf",
    "extractedTextLength": 2400
  }
}
```

---

## 4. Application Management Endpoints

### `GET /applications`
Retrieves all applications.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:**
  - `status` (optional): `applied` | `screening` | `interview` | `offered` | `rejected`
  - `candidateId` (optional): Filter applications for a specific candidate
  - `jobId` (optional): Filter applications for a specific job
- **Success (200 OK):** Returns array of populated application documents.

### `POST /applications`
Links a candidate to a job opening.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Body:**
```json
{
  "candidateId": "6afdcbe5b4a8509fa364bd48",
  "jobId": "6afdc8e6aacff30c3f3c2dc9",
  "status": "applied"
}
```
- **Success (201 Created):** Returns created application.
- **Error (400 Bad Request):** If candidate or job does not exist, or if application is a duplicate.

### `PATCH /applications/:id/status`
Updates an application's stage independently.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Body:** `{ "status": "interview" }`
- **Success (200 OK):** Returns updated application document.
