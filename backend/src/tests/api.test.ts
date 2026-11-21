import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { Socket } from 'net';
import { createApp } from '../app.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

interface RequestOptions {
  method?: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

interface TestResponse {
  statusCode: number;
  headers: Record<string, any>;
  data: any;
  text: string;
}

// In-process HTTP dispatcher simulating real lowercased Node HTTP server requests
function dispatchRequest(app: any, options: RequestOptions): Promise<TestResponse> {
  return new Promise((resolve, reject) => {
    try {
      const socket = new Socket();
      const req = new http.IncomingMessage(socket);
      req.method = options.method || 'GET';
      req.url = options.url;

      // Lowercase all request headers as Node.js HTTP parser does in production
      const normalizedHeaders: Record<string, string> = { host: 'localhost' };
      if (options.headers) {
        for (const [k, v] of Object.entries(options.headers)) {
          normalizedHeaders[k.toLowerCase()] = v;
        }
      }
      req.headers = normalizedHeaders;

      const res = new http.ServerResponse(req);
      let rawData = '';

      res.write = function (chunk: any) {
        if (chunk) rawData += chunk.toString();
        return true;
      };

      res.end = function (chunk: any) {
        if (chunk) rawData += chunk.toString();
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (_) {
          parsed = rawData;
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.getHeaders(),
          data: parsed,
          text: rawData,
        });
        return this;
      };

      if (options.body) {
        const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        if (!req.headers['content-type']) {
          req.headers['content-type'] = 'application/json';
        }
        req.headers['content-length'] = Buffer.byteLength(bodyStr).toString();

        app(req, res);
        req.emit('data', Buffer.from(bodyStr));
        req.emit('end');
      } else {
        app(req, res);
        req.emit('end');
      }
    } catch (err) {
      reject(err);
    }
  });
}

describe('SkillSync Backend Automated Test Suite', () => {
  const app = createApp();

  describe('1. Health Check & Core Infrastructure', () => {
    test('GET /api/health returns 200 OK with service identifier', async () => {
      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/health',
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.data.status, 'ok');
      assert.equal(res.data.service, 'SkillSync Backend API');
    });

    test('GET /unknown-route returns 404 with structured JSON error', async () => {
      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/unknown-route-error-check',
      });

      assert.equal(res.statusCode, 404);
      assert.equal(res.data.success, false);
      assert.equal(res.data.message, 'Resource not found');
    });
  });

  describe('2. Authentication & JWT Security Tokens', () => {
    test('generateToken and verifyToken generate and decode valid HMAC-SHA256 tokens', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', role: 'Admin' as const };
      const token = generateToken(payload);
      assert.ok(typeof token === 'string' && token.length > 20);

      const decoded = verifyToken(token);
      assert.equal(decoded.userId, payload.userId);
      assert.equal(decoded.role, 'Admin');
    });

    test('verifyToken throws when verifying an altered or tampered token', () => {
      assert.throws(() => {
        verifyToken('invalid.token.signature');
      });
    });

    test('POST /api/auth/login rejects empty email with 400', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/auth/login',
        body: { email: '', password: 'Password@123' },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Email is required/i);
    });

    test('POST /api/auth/login rejects empty password with 400', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/auth/login',
        body: { email: 'admin@skillsync.com', password: '' },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Password is required/i);
    });

    test('GET /api/auth/me rejects missing Authorization header with 401', async () => {
      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/auth/me',
      });

      assert.equal(res.statusCode, 401);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /token missing or invalid/i);
    });

    test('GET /api/auth/me rejects an invalid Bearer token with 401', async () => {
      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/auth/me',
        headers: { authorization: 'Bearer forged.fake.jwt.token' },
      });

      assert.equal(res.statusCode, 401);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Invalid or expired token/i);
    });
  });

  describe('3. Role-Based Access Control (RBAC)', () => {
    test('Recruiter role is strictly forbidden (403) from Admin-only endpoints', async () => {
      const recruiterToken = generateToken({
        userId: '507f1f77bcf86cd799439012',
        role: 'Recruiter',
      });

      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/protected/admin-only',
        headers: { authorization: `Bearer ${recruiterToken}` },
      });

      assert.equal(res.statusCode, 403);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Access requires one of the following roles: Admin/i);
    });

    test('Admin role is granted access (200) to Admin-only endpoints', async () => {
      const adminToken = generateToken({
        userId: '507f1f77bcf86cd799439013',
        role: 'Admin',
      });

      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/protected/admin-only',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.data.success, true);
      assert.match(res.data.message, /Welcome Admin/i);
    });

    test('Recruiter role is granted access (200) to Recruiter-only endpoints', async () => {
      const recruiterToken = generateToken({
        userId: '507f1f77bcf86cd799439014',
        role: 'Recruiter',
      });

      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/protected/recruiter-only',
        headers: { authorization: `Bearer ${recruiterToken}` },
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.data.success, true);
      assert.match(res.data.message, /Welcome Recruiter/i);
    });
  });

  describe('4. Input Validation & Parameter Guard Middleware', () => {
    const validRecruiterToken = generateToken({
      userId: '507f1f77bcf86cd799439015',
      role: 'Recruiter',
    });

    test('POST /api/jobs validates title and description presence', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/jobs',
        headers: { authorization: `Bearer ${validRecruiterToken}` },
        body: {
          title: '',
          description: 'A job without title',
        },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.ok(res.data.message);
    });

    test('POST /api/jobs rejects invalid experience bounds (experienceMin > experienceMax)', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/jobs',
        headers: { authorization: `Bearer ${validRecruiterToken}` },
        body: {
          title: 'Senior Engineer',
          description: 'Engineering role',
          requiredSkills: ['Node.js'],
          experienceMin: 5,
          experienceMax: 2, // invalid
        },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Maximum experience must be greater than or equal to minimum experience/i);
    });

    test('GET /api/jobs/:id rejects non-hex ObjectId format with 400', async () => {
      const res = await dispatchRequest(app, {
        method: 'GET',
        url: '/api/jobs/not-a-valid-hex-id',
        headers: { authorization: `Bearer ${validRecruiterToken}` },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Invalid id format/i);
    });

    test('POST /api/candidates validates email format and experience bounds', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/candidates',
        headers: { authorization: `Bearer ${validRecruiterToken}` },
        body: {
          name: 'Jane Doe',
          email: 'invalid-email-string',
          skills: [],
          experienceYears: -2,
        },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.ok(res.data.message);
    });

    test('POST /api/applications rejects missing or malformed candidateId/jobId', async () => {
      const res = await dispatchRequest(app, {
        method: 'POST',
        url: '/api/applications',
        headers: { authorization: `Bearer ${validRecruiterToken}` },
        body: {
          candidateId: 'invalid-format-id',
        },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.ok(res.data.message);
    });

    test('PATCH /api/applications/:id/status rejects unauthorized status enum values', async () => {
      const validMongoId = '507f1f77bcf86cd799439016';
      const res = await dispatchRequest(app, {
        method: 'PATCH',
        url: `/api/applications/${validMongoId}/status`,
        headers: { authorization: `Bearer ${validRecruiterToken}` },
        body: {
          status: 'invalid_status_value',
        },
      });

      assert.equal(res.statusCode, 400);
      assert.equal(res.data.success, false);
      assert.match(res.data.message, /Invalid or missing status/i);
    });
  });
});
