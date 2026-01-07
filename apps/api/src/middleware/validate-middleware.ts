import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

import { ServerMessages, StatusCodes } from '#constants';
import { LoginSchema, RegisterSchema } from '#root/types/request-types';

const formatError = (error: z.ZodError) => error
    .issues
    .reduce((acc: Record<string, string>, issue) => {
        const key = issue.path.map(String).join('.');
        acc[key] = issue.message;
        return acc;
    }, {});

export const validate = <T extends z.ZodType>(schema: T) => {
    return (req: Request<RegisterSchema | LoginSchema>, _res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req.body);

            req.body = validatedData;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = formatError(error);

                const validationError = createError(
                    StatusCodes.BAD_REQUEST,
                    ServerMessages.VALIDATION_FAILED,
                    { details: formattedErrors }
                );
            
                return next(validationError);
            }

            next(error);
        }
    };
};
   