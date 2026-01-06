import express, { Router } from 'express';

import { RouterPaths } from '#constants';
import { authContoller } from '#root/controllers/auth-controller';
import { validateRegister } from '#root/middleware/validate-middleware';

export const authRouter: Router = express.Router();

authRouter.post(RouterPaths.REGISTER, validateRegister, authContoller.register);
authRouter.post(RouterPaths.LOGIN, authContoller.login);
authRouter.post(RouterPaths.LOGOUT, authContoller.logout);
