import { Request, Response, NextFunction } from 'express';

import { UserInfo } from '@repo/types';

import { StatusCodes, ServerMessages } from '#constants';
import { userModel } from '#models/user-model';

class AuthController {
    async register(req: Request<UserInfo & { password: string }>, res: Response, next: NextFunction) {
        try {
            const { ...userData } = req.body;

            await userModel.createUser(userData);

            res.status(StatusCodes.CREATED).json({
                statusCode: res.statusCode,
                message: ServerMessages.REGISTRATION_SUCCESS,
                data: userData,
            });
        } catch(err) {
            next(err);
        }
    }
}

export const authContoller = new AuthController();