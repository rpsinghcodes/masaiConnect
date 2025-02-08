import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import User from '../../../models/user.model.js';
import jwt from 'jsonwebtoken';

// get the email of user
// generate a token
// send reset link to user email

const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    const password = req.body.password;
    if (password.trim().length == 0) {
        throw new ApiError(401, 'Password is required');
    }
    const decode = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET as string);
    if (!decode) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findById((decode as any).id);
    if (!user) {
        throw new ApiError(404, 'Invalid Token');
    }
    user.password = password;
    await user.save({ validateBeforeSave: false });
    // send email to user that password has been reset
    return res.status(200).json(new ApiResponse(200, {}, 'Password reset successfully'));
});

export default resetPassword;
