import { Request, Response, NextFunction } from 'express';

import { UserRequest } from '@repo/types';

import { StatusCodes, ServerMessages } from '#constants';
import { userModel } from '#models/user-model';
import { authService } from '#root/services/auth-service';

class AuthController {
    register = async (req: Request<UserRequest>, res: Response, next: NextFunction) => {
        try {
            const { ...userData } = req.body;

            await userModel.createUser(userData);

            return res
                .status(StatusCodes.CREATED)
                .json({
                    statusCode: res.statusCode,
                    message: ServerMessages.REGISTRATION_SUCCESS,
                    data: userData,
                });
        } catch(err) {
            next(err);
        }
    };

    login = async (req: Request<UserRequest>, res: Response, next: NextFunction) => {
        try {
            const { email: requestEmail, password } = req.body;
            const deviceInfo = req.headers['user-agent'];
            const ip = req.ip;

            const { user, accessToken, refreshToken } = await authService.login(requestEmail, password, deviceInfo, ip);

            return res
                .status(StatusCodes.OK)
                .json({
                    statusCode: res.statusCode,
                    message: ServerMessages.LOGIN_SUCCESS,
                    data: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
        } catch(err) {
            next(err);
        }
    };
}

export const authContoller = new AuthController();