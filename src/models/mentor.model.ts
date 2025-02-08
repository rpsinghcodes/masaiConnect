import mongoose, { Schema } from 'mongoose';

// Defining the interface for the slot details
export interface SlotDetails {
  day: string;
  startTime: string;
  endTime: string;
}

// slot details schema
const SlotDetailsSchema = new Schema({
  day: {
    type: String,
    required: [true, 'Please provide available day'],
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide the start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide the end time'],
  },
});

// Defining the interface for passed Session
export interface PassedSession {
  sessionId: mongoose.Schema.Types.ObjectId;
  mentorId: mongoose.Schema.Types.ObjectId; //mentor receiving the  session
}

const PassedSessionSchema = new Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId, // Single session ID
      ref: 'Session', // Reference to the Session model
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId, // Mentor ID receiving the passed session
      ref: 'Mentor', // Reference to the Mentor model
      required: true,
    },
  },
  { timestamps: true }, // timestamps to track when the session was passed
);
// Student schema definition
const MentorSchema: Schema = new Schema(
  {
    subRole: {
      type: [String], // Array of strings
      enum: ['mentor', 'ia', 'leadership', 'ec'], // Allowed roles only
      default: ['mentor'], // Default role is "mentor"
    },
    skills: {
      type: [String],
    },
    prevCoursesAssigned: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Course', // refers to  Course model
    },

    currentCoursesAssigned: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Course', // refers to Course model
    },
    bookedSessions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Session', //refers to session model
    },

    slots: [SlotDetailsSchema],
    passedSession: [PassedSessionSchema],
  },
  { timestamps: true },
);

export interface MentorInterface {
  subRole: string[];
  skills: string[];
  prevCoursesAssigned: mongoose.Types.ObjectId[];
  currentCoursesAssigned: mongoose.Types.ObjectId[];
  bookedSessions: mongoose.Types.ObjectId[];
  slots: SlotDetails[];
  passedSession: PassedSession[];
}

const Mentor = mongoose.model<MentorInterface>('Mentor', MentorSchema);

export default Mentor;
