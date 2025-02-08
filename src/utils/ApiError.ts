import logger from '../config/logger.js';
class ApiError extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    errors: any[];

    constructor(statusCode: number, message: string = 'Something went wrong', errors: any[] = [], stack: string = '') {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        logger.error(message);
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
