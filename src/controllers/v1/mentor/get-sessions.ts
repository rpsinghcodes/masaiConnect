import { Request, Response } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import Session from '../../../models/sessions.model.js';

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
    const { mentorId } = req.params;

    if (!mentorId) {
        throw new ApiError(400, 'Mentor ID is required');
    }

    // Find all session where start time grater and equal to today's date and where status is pending or approved
    const requestedSessions = await Session.find({
        sessionMembers: {
            host: {
                userId: mentorId,
            },
        },
        startTime: {
            $gte: new Date(),
        },
        status: {
            $in: ['pending', 'approve'],
        },
    });

    if (!requestedSessions) {
        throw new ApiError(400, 'No sessions found');
    }

    if (requestedSessions.length === 0) {
        throw new ApiError(400, 'There are no sessions available');
    }

    return res.status(200).json(new ApiResponse(200, requestedSessions, 'Requested sessions found'));
});
