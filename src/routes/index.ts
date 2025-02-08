import express from 'express';
import authRoute from './auth.route.js';
import studentRoute from './student.route.js';
import mentorRoute from './mentor.route.js';
const router = express.Router();

router.use('/auth', authRoute);
router.use('/student', studentRoute);
router.use('/mentor', mentorRoute);

export default router;
