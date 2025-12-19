import express, { Router } from 'express';

import { RouterPaths } from '#constants';
import { authContoller } from '#root/controllers/auth-controller';

export const authRouter: Router = express.Router();

authRouter.post(RouterPaths.REGISTER, authContoller.register);
authRouter.post(RouterPaths.LOGIN, authContoller.login);
