import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import User, { UserInterface } from '../models/user.model.js';

// Extend the Express Request type
interface AuthenticatedRequest extends Request {
    user?: Document<unknown, {}, UserInterface> & UserInterface & { _id: string };
}

interface DecodedToken {
    _id: string;
    iat: number;
    exp: number;
}

const authMiddleware = (roles: any) => {
    return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let incomingToken = req.cookies.access_token || req.headers.authorization?.replace('Bearer ', '');
        if (!incomingToken) {
            throw new ApiError(401, 'Unauthorized Request');
        }

        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(incomingToken, process.env.JWT_ACCESS_SECRET as string) as DecodedToken;
        } catch (error) {
            throw new ApiError(401, 'Invalid or Expired Token');
        }

        let user = (await User.findById(decoded._id)) as Document<unknown, {}, UserInterface> &
            UserInterface & { _id: string };
        if (!user) {
            throw new ApiError(401, 'Invalid Token');
        }
        let incomingRole = req.cookies.role || req.headers.role;
        if (!roles.includes(incomingRole)) {
            throw new ApiError(401, 'Unauthorized Request');
        }
        req.user = user; // ✅ Now TypeScript recognizes `user` correctly
        next();
    });
};

export default authMiddleware;
