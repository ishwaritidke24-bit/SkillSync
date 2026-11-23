import { Request, Response } from 'express';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

const app = createApp();

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (err: any) {
    console.error('[Serverless Handler Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed in serverless handler',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}
