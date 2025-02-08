import { Request, Response } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import Mentor from '../../../models/mentor.model.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';

export const profileSetup = asyncHandler(async (req: Request, res: Response) => {
    const { mentorId, currentCourses, slots } = req.body;

    const mentor = await Mentor.findByIdAndUpdate(mentorId, { $set: { currentCourses, slots } });

    if (!mentor) {
        throw new ApiError(400, 'Mentor not found');
    }

    return res.status(200).json(new ApiResponse(200, {}, 'Mentor profile setup successful'));
});
