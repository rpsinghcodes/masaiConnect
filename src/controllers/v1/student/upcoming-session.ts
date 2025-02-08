import { Request, Response, NextFunction } from 'express';
import Student from '../../../models/student.model.js';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import Session from '../../../models/sessions.model.js';

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
}

const upcomingSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract the authenticated user's ID from the request
    const userId = req.user?._id;

    // Get the current time
    const now = new Date();

    // Find the student associated with the authenticated user
    const student = await Student.findOne({ _id: userId }).populate({
        path: 'bookedSessions',
        model: Session,
        match: {
            $or: [
                { startTime: { $gte: now }, status: 'approve' }, // Future sessions
                { startTime: { $lte: now }, endTime: { $gte: now }, status: 'approve' }, // Ongoing sessions
            ],
        },
        select: 'title description type startTime endTime status',
    });

    if (!student) {
        return next(new ApiError(404, 'Student not found'));
    }

    const upcomingSessions = student.bookedSessions;

    if (!upcomingSessions || upcomingSessions.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], 'No upcoming sessions found.'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, upcomingSessions, 'Upcoming sessions (ongoing and future) retrieved successfully.'));
});

export default upcomingSessions;
