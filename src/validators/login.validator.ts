import {body} from 'express-validator';

const loginValidation = [
    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format'),

    body('password')
    .isString()
    .isLength({min:6})
    .withMessage('Password is required')
];

export default loginValidation;