# SkillSync – Database Schema Specification

SkillSync strictly utilizes seven MongoDB collections as defined in the system architecture.

## Collections Overview

| # | Collection | Description | Status |
|---|---|---|---|
| 1 | `users` | Admin and Recruiter credentials and role assignments | **Implemented (Phase 1)** |
| 2 | `jobs` | Job postings, required skills, and experience criteria | **Implemented (Phase 2)** |
| 3 | `candidates` | Candidate profiles, contact details, and skill sets | Phase 3 |
| 4 | `applications` | Application links connecting candidates to specific jobs | Phase 3 |
| 5 | `resumes` | Private resume metadata and extracted text content | Phase 3 |
| 6 | `screeningresults` | AI evaluation, matching criteria, and gap explanations | Phase 4 |
| 7 | `interviewquestions` | AI-generated interview questions per application | Phase 4 |

---

## Detailed Collection Definitions

### 1. `User` (Implemented in Phase 1)
Stores administrative and recruiter accounts.

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
Stores job recruitment positions, required skill arrays, experience thresholds, and status.

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

### 3. `Candidate` (Scheduled for Phase 3)
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone?: string,
  skills: string[],
  experienceYears?: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. `Application` (Scheduled for Phase 3)
Links one candidate to a specific job with an independent status.
```typescript
{
  _id: ObjectId,
  candidateId: ObjectId, // ref: Candidate
  jobId: ObjectId,       // ref: Job
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### 5. `Resume` (Scheduled for Phase 3)
Stores private file metadata and parsed text content.
```typescript
{
  _id: ObjectId,
  candidateId: ObjectId, // ref: Candidate
  fileName: string,
  filePath: string,      // private storage path
  mimeType: string,
  fileSize: number,
  extractedText: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. `ScreeningResult` (Scheduled for Phase 4)
Stores Gemini AI screening outputs.
```typescript
{
  _id: ObjectId,
  applicationId: ObjectId, // ref: Application
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
  applicationId: ObjectId, // ref: Application
  questions: Array<{
    question: string,
    category: string,
    context?: string
  }>,
  createdAt: Date,
  updatedAt: Date
}
```
