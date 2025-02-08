import { Request, Response, NextFunction } from 'express';
import User from '../../../models/user.model.js';
import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    _id: string;
    role: string;
    status: string;
}

const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const incomingRefreshToken =
        req.cookies.refreshToken ||
        ((typeof req.headers.authorization === 'string' ? req.headers.authorization.replace('Bearer ', '') : '') as string);
    console.log(incomingRefreshToken);
    if (!incomingRefreshToken) {
        throw new ApiError(400, 'Please Login to continue');
    }
    let decoded: DecodedToken;
    decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET as string) as DecodedToken;
    if (!decoded) {
        throw new ApiError(400, 'Please Login to continue');
    }
    const user = await User.findById(decoded._id);
    if (!user) {
        throw new ApiError(404, 'Please Login to continue');
    }
    const accessToken = await user.generateAccessToken();
    return res
        .status(200)
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, {}, 'Access Token Refreshed Successfully'));
});

export default refreshAccessToken;
