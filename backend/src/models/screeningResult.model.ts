import mongoose, { Document, Schema } from 'mongoose';

export interface IScreeningResult extends Document {
  application: mongoose.Types.ObjectId;
  matchingSkills: string[];
  missingSkills: string[];
  experienceAnalysis: string;
  explanation: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const screeningResultSchema = new Schema<IScreeningResult>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
      unique: true, // One active screening result per application
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    experienceAnalysis: {
      type: String,
      required: [true, 'Experience analysis is required'],
      trim: true,
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Screening summary is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ScreeningResult = mongoose.model<IScreeningResult>(
  'ScreeningResult',
  screeningResultSchema
);
