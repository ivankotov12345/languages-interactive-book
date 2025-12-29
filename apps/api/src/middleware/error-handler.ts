import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

import { ServerMessages, StatusCodes } from '#constants';

export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode: number = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = err.message || ServerMessages.INTERNAL_SERVER_ERROR;
    const errorStack = process.env.NODE_ENV === 'development' && err.stack;
    
    res.status(statusCode).json({
        statusCode: statusCode,
        name: err.name,
        message: errorMessage,
        stack: errorStack,
    });
};
