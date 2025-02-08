import { body } from 'express-validator';

const profileSetupValidation = [
    body('mentorId')
        .isString()
        .withMessage('Mentor ID is required')
        .bail()
        .isLength({ min: 1 })
        .withMessage('Invalid mentor ID'),

    body('currentCourses')
        .isArray()
        .withMessage('Current courses is required')
        .bail()
        .isLength({ min: 1 })
        .withMessage('Invalid current courses'),

    body('slots').isArray().withMessage('Slots is required'),
];

export default profileSetupValidation;
