import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

import { emailSchema, nonEmptyStringSchema, passwordSchema } from '@repo/validation';

import { ServerMessages, StatusCodes } from '#constants';

const registerSchema = z.object({
    email: emailSchema,
    username: emailSchema,
    firstName: nonEmptyStringSchema,
    lastName: nonEmptyStringSchema,
    password: passwordSchema,
});

type RegisterSchema = z.output<typeof registerSchema>

export const validateRegister = (req: Request<RegisterSchema>, res: Response, next: NextFunction) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.issues.reduce((acc: Record<string, string>, issue) => {
                const key = issue.path.map(String).join('.');
                acc[key] = issue.message;
                return acc;
            }, {});

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
