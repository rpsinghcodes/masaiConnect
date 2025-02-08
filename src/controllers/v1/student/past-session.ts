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

const pastSession = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract the authenticated user's ID from the request
    const userId = req.user?._id;

    //  current time
    const now = new Date();

    // Pagination parameters from query
    const page = parseInt(req.query.page as string, 5) || 1; // Default page is 1
    const limit = parseInt(req.query.limit as string, 5) || 5; // Default limit is  5
    const skip = (page - 1) * limit;

    // Find the student associated with the authenticated user
    const student = await Student.findOne({ _id: userId }).populate({
        path: 'bookedSessions',
        model: Session,
        match: { endTime: { $lt: now }, status: 'approve' },
        select: 'title description type startTime endTime status',
        options: { skip, limit },
    });

    if (!student) {
        return next(new ApiError(404, 'Student not found'));
    }

    const pastSessions = student.bookedSessions;

    if (!pastSessions || pastSessions.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], 'No past sessions found'));
    }

    // Get the total count of past sessions for pagination
    const totalPastSessions = await Session.countDocuments({
        /* eslint-disable @typescript-eslint/no-explicit-any */
        _id: { $in: student.bookedSessions.map((s: any) => s._id) },
        endTime: { $lt: now },
        status: 'approve',
    });

    const totalPages = Math.ceil(totalPastSessions / limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                sessions: pastSessions,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalRecords: totalPastSessions,
                },
            },
            'Past sessions retrieved successfully'
        )
    );
});

export default pastSession;
