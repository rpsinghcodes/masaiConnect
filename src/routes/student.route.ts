import express from 'express';
import pastSession from '../controllers/v1/student/past-session.js';
import upcomingSessions from '../controllers/v1/student/upcoming-session.js';
import { profileSetup, getStudentProfile } from '../controllers/v1/student/profileSetup.js';
import { studentValidator } from '../validators/studentValidator.js';
import handleValidationErrors from '../middlewares/validationErrorHandlert.js';

const studentRoute = express.Router();

studentRoute.post('/profile-setup', studentValidator, handleValidationErrors, profileSetup);
studentRoute.get('/:studentCode', getStudentProfile);

studentRoute.get('/get-upcoming-sessions', upcomingSessions);
studentRoute.get('/get-past-sessions', pastSession);
export default studentRoute;
