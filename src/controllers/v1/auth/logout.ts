import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import User, { UserInterface } from '../../../models/user.model.js';

// Extend the Express Request type

interface AuthenticatedRequest extends Request {
    user?: Document<unknown, {}, UserInterface> & UserInterface & { _id: string };
}

const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'User not authenticated'));
    }
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1, // this removes the field from document
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .clearCookie('role', options)
        .json(new ApiResponse(200, {}, 'User logged out'));
});

export default logout;
