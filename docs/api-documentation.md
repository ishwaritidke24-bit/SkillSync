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
  "email": "admin@skillsync.com",
  "password": "Admin@123456"
}
```
- **Validation Rules:**
  - `email`: Required, valid email format
  - `password`: Required, minimum 6 characters
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "673b889396e95c479428ad10",
      "email": "admin@skillsync.com",
      "name": "System Admin",
      "role": "Admin"
    }
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing or invalid input format
  - `401 Unauthorized`: Invalid email or password

---

### `GET /auth/me`
Retrieves information about the currently logged-in user.

- **Access:** Protected (Admin, Recruiter)
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "673b889396e95c479428ad10",
    "email": "admin@skillsync.com",
    "name": "System Admin",
    "role": "Admin",
    "createdAt": "2026-11-18T14:00:00.000Z"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Missing, invalid, or expired token

---

## 2. Protected Role Verification Endpoints (Phase 1)

### `GET /protected/authenticated`
- **Access:** Any authenticated user (`Admin` or `Recruiter`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Access granted to authenticated user."
}
```

### `GET /protected/admin-only`
- **Access:** `Admin` only
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome Admin: access granted to admin resources."
}
```
- **Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden: Access requires one of the following roles: Admin"
}
```

### `GET /protected/recruiter-only`
- **Access:** `Recruiter` only
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome Recruiter: access granted to recruiter resources."
}
```
- **Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden: Access requires one of the following roles: Recruiter"
}
```
