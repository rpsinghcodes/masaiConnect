import { body } from 'express-validator';

const registrationValidation = [
    body('name').isString().isLength({ min: 1 }).withMessage('Name is required'),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail() // Stop validation if the field is empty
        .isEmail()
        .withMessage('Invalid email format'),

    body('password').isString().isLength({ min: 6 }).withMessage('Password is required'),

    body('phoneNumber').isNumeric().isLength({ min: 10 }).withMessage('Phone number is required'),
];

export default registrationValidation;
