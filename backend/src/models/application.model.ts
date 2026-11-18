import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';

export interface IApplication extends Document {
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate reference is required'],
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offered', 'rejected'],
      default: 'applied',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same candidate and job
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
