import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  candidate: mongoose.Types.ObjectId;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  extractedText: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate reference is required'],
      unique: true, // One active resume document per candidate
    },
    fileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'Private file path is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    extractedText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
