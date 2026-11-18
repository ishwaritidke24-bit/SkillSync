# SkillSync – Database Schema Specification

SkillSync strictly utilizes seven MongoDB collections as defined in the system architecture.

## Collections Overview

| # | Collection | Description | Status |
|---|---|---|---|
| 1 | `users` | Admin and Recruiter credentials and role assignments | **Implemented (Phase 1)** |
| 2 | `jobs` | Job postings, required skills, and experience criteria | **Implemented (Phase 2)** |
| 3 | `candidates` | Candidate profiles, contact details, and skill sets | **Implemented (Phase 3)** |
| 4 | `applications` | Application links connecting candidates to specific jobs | **Implemented (Phase 3)** |
| 5 | `resumes` | Private resume metadata and extracted text content | **Implemented (Phase 3)** |
| 6 | `screeningresults` | AI evaluation, matching criteria, and gap explanations | Phase 4 |
| 7 | `interviewquestions` | AI-generated interview questions per application | Phase 4 |

---

## Detailed Collection Definitions

### 1. `User` (Implemented in Phase 1)
```typescript
{
  _id: ObjectId,
  email: string,        // unique, lowercase, trimmed
  password: string,     // hashed with bcrypt
  name: string,         // user's full name
  role: 'Admin' | 'Recruiter', // role-based authorization
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `Job` (Implemented in Phase 2)
```typescript
{
  _id: ObjectId,
  title: string,                 // required, trimmed
  description: string,           // required, trimmed
  requiredSkills: string[],      // required, non-empty array of skill strings
  experienceMin: number,         // required, min: 0
  experienceMax: number,         // required, min: experienceMin
  status: 'active' | 'deactivated', // default: 'active'
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `Candidate` (Implemented in Phase 3)
Stores candidate contact information, skills array, experience, and resume reference.
```typescript
{
  _id: ObjectId,
  name: string,                  // required, trimmed
  email: string,                 // required, unique, lowercase, trimmed
  phone?: string,                // optional, trimmed
  skills: string[],              // required, non-empty array
  experienceYears: number,       // required, min: 0
  resume?: ObjectId,             // ref: Resume, default: null
  createdAt: Date,
  updatedAt: Date
}
```

### 4. `Resume` (Implemented in Phase 3)
Stores private file metadata and plain text parsed from the uploaded PDF.
```typescript
{
  _id: ObjectId,
  candidate: ObjectId,           // ref: Candidate, required, unique
  fileName: string,              // original uploaded file name
  filePath: string,              // private server storage path (uploads/resumes/...)
  mimeType: string,              // 'application/pdf'
  fileSize: number,              // bytes
  extractedText: string,         // plain text extracted by pdf-parse
  createdAt: Date,
  updatedAt: Date
}
```

### 5. `Application` (Implemented in Phase 3)
Links one candidate to a specific job with an independent status.
```typescript
{
  _id: ObjectId,
  candidate: ObjectId,           // ref: Candidate, required
  job: ObjectId,                 // ref: Job, required
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'rejected', // default: 'applied'
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index: { candidate: 1, job: 1 } prevents duplicate submissions
```

### 6. `ScreeningResult` (Scheduled for Phase 4)
Stores Gemini AI screening outputs.
```typescript
{
  _id: ObjectId,
  application: ObjectId, // ref: Application
  matchingSkills: string[],
  missingSkills: string[],
  experienceAnalysis: string,
  explanation: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. `InterviewQuestion` (Scheduled for Phase 4)
Stores tailored questions for candidate interviews.
```typescript
{
  _id: ObjectId,
  application: ObjectId, // ref: Application
  questions: Array<{
    question: string,
    category: string,
    context?: string
  }>,
  createdAt: Date,
  updatedAt: Date
}
```
