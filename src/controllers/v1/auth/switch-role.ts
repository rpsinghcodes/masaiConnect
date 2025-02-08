import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import { UserInterface } from '../../../models/user.model.js';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: Document<unknown, {}, UserInterface> & UserInterface & { role: string };
}

const switchRole = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const IncomingRole = req.body.role;
    const user = req.user;
    const role = jwt.sign({ role: IncomingRole }, process.env.ROLE_BASE_TOKEN_SECRET as string, {
        expiresIn: parseInt(process.env.ROLE_BASE_TOKEN_EXPIRY as string),
    });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie('role', role, options)
        .json(new ApiResponse(200, user, 'Role switched successfully'));
});

export default switchRole;
