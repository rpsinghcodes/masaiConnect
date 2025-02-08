import mongoose, { Schema } from 'mongoose';

// Defining the interface for education details

export interface EducationDetails {
    collegeName: string;
    degree: string;
    startDate: Date;
    endDate: Date | null; // Optional field for end date,null if ongoing course
}

// Education details schema
const educationDetailsSchema = new Schema({
    collegeName: {
        type: String,
        required: [true, 'Please provide the college name'],
    },
    degree: {
        type: String,
        required: [true, 'Please provide the degree'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide the start date'],
    },
    endDate: {
        type: Date,
        default: null,
    },
});

// Interface for Past Experience
export interface PastExperience {
    organisationName: string;
    startDate: Date;
    endDate: Date | null;
    jobTitle: string;
    areaOfResponsibility: string;
}

// Past Experience Schema Definition
const pastExperienceSchema = new Schema({
    organisationName: {
        type: String,
        required: [true, 'Please provide the company name'],
    },
    jobTitle: {
        type: String,
        required: [true, 'Please provide the role'],
    },
    areaOfResponsibility: {
        type: String,
        required: [true, 'Please enter area of responsibility'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide the start date'],
    },
    endDate: {
        type: Date,
        default: null,
    },
});

// Student schema definition
const StudentSchema: Schema = new Schema(
    {
        studentCode: {
            type: String,
            required: [true, 'Please provide your student code'],
            unique: true,
        },
        subRole: {
            type: [String],
            enum: ['student', 'alumni', 'senior-alumni', 'contributor'],
            default: ['student'],
        },
        enrolledCourses: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: 'Course', // refers to  Course model
        },
        currentCourses: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: 'Course', // refers to Course model
        },
        skills: [String],
        bookedSessions: {
            //has future,past and pre
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: 'Session', // refers to  Session model
        },
        educationDetails: [educationDetailsSchema],
        pastExperience: [pastExperienceSchema],
    },

    { timestamps: true }
);

export interface StudentInterface {
    studentCode: string;
    subRole: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    currentCourse: mongoose.Types.ObjectId[];
    bookedSessions: mongoose.Types.ObjectId[];
    skills: string[];
    educationDetails: EducationDetails[];
    pastExperience: PastExperience[];
}

const Student = mongoose.model<StudentInterface>('Student', StudentSchema);

export default Student;
