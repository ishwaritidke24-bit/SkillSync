import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  resume?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Candidate must have at least one skill',
      },
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience years cannot be negative'],
      default: 0,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);
