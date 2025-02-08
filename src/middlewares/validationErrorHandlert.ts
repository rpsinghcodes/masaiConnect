import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation error', errors.array());
    }
    next();
};

export default handleValidationErrors;
