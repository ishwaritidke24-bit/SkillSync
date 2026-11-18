import mongoose, { Document, Schema } from 'mongoose';

export type JobStatus = 'active' | 'deactivated';

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Required skills are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one required skill must be provided',
      },
    },
    experienceMin: {
      type: Number,
      required: [true, 'Minimum experience is required'],
      min: [0, 'Minimum experience cannot be negative'],
    },
    experienceMax: {
      type: Number,
      required: [true, 'Maximum experience is required'],
      min: [0, 'Maximum experience cannot be negative'],
      validate: {
        validator: function (this: IJob, value: number) {
          if (typeof this.experienceMin === 'number') {
            return value >= this.experienceMin;
          }
          return true;
        },
        message: 'Maximum experience must be greater than or equal to minimum experience',
      },
    },
    status: {
      type: String,
      enum: ['active', 'deactivated'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>('Job', jobSchema);
