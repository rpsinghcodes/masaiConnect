import { Request, Response } from 'express';
import asyncHandler from '../../../utils/AsyncHandler.js';
import User from '../../../models/user.model.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

interface IGenerateTokens {
    accessToken: string;
    refreshToken: string;
}

async function generateAccessTokenAndRefreshToken(user: any): Promise<IGenerateTokens> {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Error generating access token and refresh token');
    }
}

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, 'Please Signup first');
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid password');
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);
    const role = jwt.sign({ role: user.role }, process.env.ROLE_BASE_TOKEN_SECRET as string, {
        expiresIn: parseInt(process.env.ROLE_BASE_TOKEN_EXPIRY as string),
    });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .cookie('role', role, options)
        .json(new ApiResponse(200, user, 'Login successful'));
});

export default login;
