import mongoose, { Document, Schema } from 'mongoose';

// Interface for feedback
export interface IFeedback extends Document {
  title: string;
  description: string;
  rating: number;
  givenBy: mongoose.Types.ObjectId;
}

// Schema for Feedback
const FeedbackSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      required: true,
    },

    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'GivenBy (User ID) is required'],
    },
  },
  { timestamps: true },
);

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
