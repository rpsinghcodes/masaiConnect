import express from 'express';
import { profileSetup } from '../controllers/v1/mentor/profile-setup.js';
import profileSetupValidation from '../validators/mentor/profile-setup.validator.js';
import handleValidationErrors from '../middlewares/validationErrorHandlert.js';
import { sessionApprove } from '../controllers/v1/mentor/session-approve.js';
import { getPastSession } from '../controllers/v1/mentor/get-past-session.js';
import { getSessions } from '../controllers/v1/mentor/get-sessions.js';

const mentorRoute = express.Router();

mentorRoute.post('/profile-setup', profileSetupValidation, handleValidationErrors, profileSetup);
mentorRoute.get('/get-sessions/:mentorId', getSessions);
mentorRoute.put('/session-approve', sessionApprove);
mentorRoute.get('/get-past-session/:mentorId', getPastSession);

export default mentorRoute;
