import { Request, Response } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import Session from '../../../models/sessions.model.js';
import Mentor from '../../../models/mentor.model.js';

export const sessionApprove = asyncHandler(async (req: Request, res: Response) => {
    const { mentorId, sessionId, sessionStatus } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
        throw new ApiError(400, 'Mentor not found');
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new ApiError(400, 'Session not found');
    }

    const zoomLink = 'https://zoom.us/j/987654321';
    session.status = sessionStatus;
    session.sessionJoinLink = zoomLink;
    await session.save();

    mentor.bookedSessions.push(sessionId);
    await mentor.save();

    return res.status(200).json(new ApiResponse(200, {}, 'Session approved successfully'));
});
