import { z } from 'zod';

import { emailSchema, nonEmptyStringSchema, passwordSchema, usernameSchema } from '@repo/validation';

export const registerSchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    firstName: nonEmptyStringSchema,
    lastName: nonEmptyStringSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
