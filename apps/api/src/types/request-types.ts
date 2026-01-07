import { z } from 'zod';

import { loginSchema, registerSchema } from '#root/constants/validation-schemas';


export type RegisterSchema = z.output<typeof registerSchema>;
export type LoginSchema = z.output<typeof loginSchema>;