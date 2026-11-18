import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionItem {
  question: string;
  category: string;
  context?: string;
}

export interface IInterviewQuestion extends Document {
  application: mongoose.Types.ObjectId;
  questions: IQuestionItem[];
  createdAt: Date;
  updatedAt: Date;
}

const questionItemSchema = new Schema<IQuestionItem>(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Question category is required'],
      trim: true,
    },
    context: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const interviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
      unique: true, // One active set of generated questions per application
    },
    questions: {
      type: [questionItemSchema],
      required: [true, 'At least one interview question is required'],
      validate: {
        validator: (v: IQuestionItem[]) => Array.isArray(v) && v.length > 0,
        message: 'Must contain at least one question',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const InterviewQuestion = mongoose.model<IInterviewQuestion>(
  'InterviewQuestion',
  interviewQuestionSchema
);
