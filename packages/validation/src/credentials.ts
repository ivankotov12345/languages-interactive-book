import z from 'zod';

import { VALIDATION_MESSAGES } from './validation-messages';

export const passwordSchema = z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.empty })
    .max(50, { message: VALIDATION_MESSAGES.maxLength })
    .regex(
        /^(?!.*[А-Яа-яЁё\s])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$&_+-.]{8,}$/,
        { message: VALIDATION_MESSAGES.passwordFormat }
    );

export const emailSchema = z
    .email({ message: VALIDATION_MESSAGES.incorrectEmail })
    .min(1, { message: VALIDATION_MESSAGES.emptyEmail })
    .max(50, { message: VALIDATION_MESSAGES.maxLength });

export const usernameSchema = z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.empty })
    .max(50, { message: VALIDATION_MESSAGES.maxLength })
    .regex(
        /^[A-Za-z0-9!@#$&_+\-.:]{5,}$/,
        { message: VALIDATION_MESSAGES.incorrectFormat }
    );