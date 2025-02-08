import { body } from 'express-validator';

const sessionApproveValidation = [
    body('mentorId').isString().withMessage('Mentor ID is required'),

    body('sessionId').isString().withMessage('Session ID is required'),

    body('sessionStatus')
        .isString()
        .withMessage('Session status is required')
        .bail()
        .isIn(['approve', 'cancel'])
        .withMessage('Invalid session status'),
];

export default sessionApproveValidation;
