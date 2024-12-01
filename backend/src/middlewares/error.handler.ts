import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }

    if (err instanceof QueryFailedError) {
        res.status(400).json({
            status: 'error',
            message: 'Database operation failed',
            details: err.message,
        });
        return;
    }

    if (err instanceof Array && err[0] instanceof ValidationError) {
        const validationErrors = err.map((error) => ({
            property: error.property,
            constraints: error.constraints,
        }));

        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: validationErrors,
        });
        return;
    }

    if (err.name === 'MulterError') {
        res.status(400).json({
            status: 'error',
            message: 'File upload error',
            details: err.message,
        });
        return;
    }

    // Default error
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
