import express from 'express';
import register from '../controllers/v1/auth/register.js';
import login from '../controllers/v1/auth/login.js';
import registrationValidation from '../validators/registration.validator.js';
import loginValidation from '../validators/login.validator.js';
import handleValidationErrors from '../middlewares/validationErrorHandlert.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import logout from '../controllers/v1/auth/logout.js';
import refreshAccessToken from '../controllers/v1/auth/refreshAccesstoken.js';
import resetPassword from '../controllers/v1/auth/reset-password.js';
import forgetPassword from '../controllers/v1/auth/forget-password.js';
import switchRole from '../controllers/v1/auth/switch-role.js';
import { createZoomMeeting, getMeetingDetails } from '../services/meeting.js';
import logger from '../config/logger.js';
const authRoute = express.Router();

authRoute.post('/register', registrationValidation, handleValidationErrors, register);
authRoute.post('/login', loginValidation, handleValidationErrors, login);
authRoute.get('/logout', authMiddleware(['user']), logout);
authRoute.get('/refreshAccessToken', refreshAccessToken);
authRoute.post('/forget-password', forgetPassword);
authRoute.post('/reset-password/:token', resetPassword);
authRoute.post('/switch-role', authMiddleware(['user']), switchRole);

authRoute.get('/meeting-details/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        logger.info(`Meeting ID: ${id}`);
        const response = await getMeetingDetails(id);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error });
    }
});

authRoute.post('/create-meeting', async (req, res) => {
    try {
        const { title, type, startTime, duration, description } = req.body;
        const meetingDetails = {
            title,
            type,
            startTime,
            duration,
            description,
        };
        const response = await createZoomMeeting(meetingDetails);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default authRoute;
