# SkillSync – REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates an Admin or Recruiter and returns a signed JWT.

- **Access:** Public
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "recruiter@skillsync.com",
  "password": "Recruiter@123456"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "673b889396e95c479428ad10",
      "email": "recruiter@skillsync.com",
      "name": "Senior Recruiter",
      "role": "Recruiter"
    }
  }
}
```

### `GET /auth/me`
Retrieves information about the currently logged-in user.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "673b889396e95c479428ad10",
    "email": "recruiter@skillsync.com",
    "name": "Senior Recruiter",
    "role": "Recruiter"
  }
}
```

---

## 2. Job Management Endpoints

All job endpoints require an authenticated user (`Admin` or `Recruiter`) via JWT Bearer token.

### `GET /jobs`
Retrieves all jobs, sorted by creation date descending.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Query Parameters:**
  - `status` (optional): `active` | `deactivated`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6afdc8e6aacff30c3f3c2dc9",
      "title": "Senior Full Stack Engineer",
      "description": "Lead full-stack development using Node.js, React, and MongoDB.",
      "requiredSkills": ["React", "Node.js", "TypeScript", "MongoDB"],
      "experienceMin": 3,
      "experienceMax": 6,
      "status": "active",
      "createdAt": "2026-11-18T15:48:48.000Z",
      "updatedAt": "2026-11-18T15:48:48.000Z"
    }
  ]
}
```

---

### `GET /jobs/:id`
Retrieves details of an individual job by its MongoDB ID.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6afdc8e6aacff30c3f3c2dc9",
    "title": "Senior Full Stack Engineer",
    "description": "Lead full-stack development using Node.js, React, and MongoDB.",
    "requiredSkills": ["React", "Node.js", "TypeScript", "MongoDB"],
    "experienceMin": 3,
    "experienceMax": 6,
    "status": "active",
    "createdAt": "2026-11-18T15:48:48.000Z",
    "updatedAt": "2026-11-18T15:48:48.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Invalid MongoDB ID format.
  - `404 Not Found`: Job not found.

---

### `POST /jobs`
Creates a new job posting.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Full Stack Engineer",
  "description": "Responsible for designing and implementing recruitment APIs.",
  "requiredSkills": ["React", "Node.js", "TypeScript", "MongoDB"],
  "experienceMin": 2,
  "experienceMax": 5,
  "status": "active"
}
```
- **Validation Rules:**
  - `title`: String, required, non-empty.
  - `description`: String, required, non-empty.
  - `requiredSkills`: Array of non-empty strings, required.
  - `experienceMin`: Number >= 0, required.
  - `experienceMax`: Number >= experienceMin, required.
  - `status`: Optional (`active` | `deactivated`), default `active`.
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "6afdc92c6544a958a4197788",
    "title": "Full Stack Engineer",
    "description": "Responsible for designing and implementing recruitment APIs.",
    "requiredSkills": ["React", "Node.js", "TypeScript", "MongoDB"],
    "experienceMin": 2,
    "experienceMax": 5,
    "status": "active",
    "createdAt": "2026-11-18T15:50:00.000Z",
    "updatedAt": "2026-11-18T15:50:00.000Z"
  }
}
```

---

### `PUT /jobs/:id`
Updates an existing job.

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:** (any subset of fields)
```json
{
  "title": "Lead Full Stack Engineer",
  "experienceMax": 7
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": { ... }
}
```

---

### `PATCH /jobs/:id/deactivate`
Deactivates a job posting (sets `status` to `deactivated` without deleting the record).

- **Access:** Protected (`Admin`, `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Job deactivated successfully",
  "data": {
    "_id": "6afdc8e6aacff30c3f3c2dc9",
    "status": "deactivated"
  }
}
```
