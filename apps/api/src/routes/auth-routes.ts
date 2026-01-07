import express, { Router } from 'express';

import { RouterPaths } from '#constants';
import { loginSchema, registerSchema } from '#root/constants/validation-schemas';
import { authContoller } from '#root/controllers/auth-controller';
import { validate } from '#root/middleware/validate-middleware';

export const authRouter: Router = express.Router();

authRouter.post(RouterPaths.REGISTER, validate(registerSchema), authContoller.register);
authRouter.post(RouterPaths.LOGIN, validate(loginSchema), authContoller.login);
authRouter.post(RouterPaths.LOGOUT, authContoller.logout);
