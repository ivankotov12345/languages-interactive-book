import { Request, Response } from 'express';

import { UserWithPassword } from '@repo/types';

import { StatusCodes, ServerMessages } from '#constants';
import { REFRESH_TOKEN_COOKIE_NAME } from '#root/constants/token';
import { authService } from '#root/services/auth-service';
import { AccessTokenData } from '#root/types/token-types';

class AuthController {
    register = async (
        req: Request<UserWithPassword<'password'>>,
        res: Response,
    ) => {
        const { ...userData }: UserWithPassword<'password'> = req.body;

        await authService.register(userData);

        res.status(StatusCodes.CREATED).json({
            statusCode: res.statusCode,
            message: ServerMessages.REGISTRATION_SUCCESS,
            data: userData,
        });
    };

    login = async (
        req: Request<UserWithPassword<'password'>>,
        res: Response,
    ) => {
        const { email: requestEmail, password } = req.body;
        const deviceInfo = req.headers['user-agent'];
        const ip = req.ip;

        const { user, accessToken, refreshToken } = await authService.login(
            requestEmail,
            password,
            deviceInfo,
            ip,
        );

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(StatusCodes.OK).json({
            statusCode: res.statusCode,
            message: ServerMessages.LOGIN_SUCCESS,
            data: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    };

    logout = async (req: Request<AccessTokenData>, res: Response) => {
        const { userId } = req.body;

        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] || req.body.token;

        await authService.logout(userId, refreshToken);

        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

        res.status(StatusCodes.OK).json({
            statusCode: res.statusCode,
            message: ServerMessages.LOGOUT_SUCCESS,
        });
    };
}

export const authContoller = new AuthController();
