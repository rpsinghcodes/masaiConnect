import mongoose, { Document, Schema } from 'mongoose';

// Interface for session member timing
interface ISessionMemberTiming {
  userId: mongoose.Types.ObjectId;
  joinTime: Date;
  leaveTime?: Date;
}

// Interface for Session
export interface ISession extends Document {
  title: string;
  description: string;
  type: 'ec-connect' | 'ia-connect' | 'leadership-connect' | 'mentor-connect';
  feedbacks: mongoose.Types.ObjectId[];
  sessionJoinLink: string;
  recordingSrc?: string | null;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'approve' | 'cancel';
  isSolo: boolean;
}

// Schema for session member timing
const sessionMemberTimingSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  joinTime: {
    type: Date,
  },
  leaveTime: {
    type: Date,
  },
});

// Schema for session members (host, co-hosts, joinee)
const sessionMemberSchema = new Schema({
  host: {
    type: sessionMemberTimingSchema,
  },
  coHosts: {
    type: [sessionMemberTimingSchema],
    default: [],
  },
  joinee: {
    type: [sessionMemberTimingSchema],
    default: [],
  },
});

// Schema for Session
const SessionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ['ec-connect', 'ia-connect', 'leadership-connect', 'mentor-connect'],
      required: [true, 'Type is required'],
    },

    sessionMembers: {
      type: sessionMemberSchema,
    },

    feedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],

    sessionJoinLink: {
      type: String,
      required: [true, 'Session join link is required'],
      trim: true,
    },

    recordingSrc: {
      type: String,
      default: null,
    },

    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },

    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },

    status: {
      type: String,
      enum: ['pending', 'approve', 'cancel'],
      required: [true, 'Session status is required'],
      default: 'pending',
    },

    isSolo: {
      type: Boolean,
      required: [true, 'isSolo field is required'],
      default: true,
    },
  },
  { timestamps: true },
);

const Session = mongoose.model<ISession>('Session', SessionSchema);
export default Session;
