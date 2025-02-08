import { Request, Response } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import Session from '../../../models/sessions.model.js';

export const getPastSession = asyncHandler(async (req: Request, res: Response) => {
    const { mentorId } = req.params;
    const { skip, limit } = req.query;

    const page = parseInt(skip as string) || 0;
    const limitValue = parseInt(limit as string) || 10;
    const skipValue = page * limitValue;

    if (!mentorId) {
        throw new ApiError(400, 'Mentor ID is required');
    }

    const pastSessions = await Session.aggregate([
        {
            $match: {
                sessionMembers: {
                    host: {
                        userId: mentorId,
                    },
                },
                status: 'completed',
            },
        },
        // {
        //   $lookup: {
        //     from: 'Course',
        //     localField: 'courseId',
        //     foreignField: '_id',
        //     as: 'course',
        //   },
        // },
        // { $unwind: '$course' },
        {
            $project: {
                title: 1,
                type: 1,
                sessionMembers: 1,
                recordingSrc: 1,
                startTime: 1,
                endTime: 1,
                // course: '$course.name',
            },
        },
        {
            $skip: skipValue,
        },
        {
            $limit: limitValue,
        },
    ]);

    if (!pastSessions) {
        throw new ApiError(400, 'No past sessions found');
    }

    return res.status(200).json(new ApiResponse(200, pastSessions, 'Past sessions found'));
});
