import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillsync';
  console.log(`Connecting to ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  const hashedPasswordAdmin = await bcrypt.hash('Admin@123456', 10);
  const hashedPasswordRecruiter = await bcrypt.hash('Recruiter@123456', 10);

  // Upsert Admin
  await User.findOneAndUpdate(
    { email: 'admin@skillsync.com' },
    {
      email: 'admin@skillsync.com',
      password: hashedPasswordAdmin,
      name: 'System Admin',
      role: 'Admin',
    },
    { upsert: true, new: true }
  );

  // Upsert Recruiter
  await User.findOneAndUpdate(
    { email: 'recruiter@skillsync.com' },
    {
      email: 'recruiter@skillsync.com',
      password: hashedPasswordRecruiter,
      name: 'Senior Recruiter',
      role: 'Recruiter',
    },
    { upsert: true, new: true }
  );

  console.log('Seed completed successfully!');
  console.log('Sample accounts created/updated:');
  console.log('Admin: admin@skillsync.com / Admin@123456 (Role: Admin)');
  console.log('Recruiter: recruiter@skillsync.com / Recruiter@123456 (Role: Recruiter)');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
