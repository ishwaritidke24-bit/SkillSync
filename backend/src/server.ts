import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[SkillSync Backend] Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
