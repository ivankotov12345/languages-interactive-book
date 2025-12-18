import { addDays } from 'date-fns';
import { Request, Response, NextFunction } from 'express';

import { UserRequest, UserServer } from '@repo/types';

import { StatusCodes, ServerMessages } from '#constants';
import { userModel } from '#models/user-model';
import { ACCES_TOKEN_EXPIRING, REFRESH_TOKEN_EXPIRING } from '#root/constants/token';
import { refreshTokenModel } from '#root/models/refresh-token-model';
import { generateToken } from '#root/utils/token';

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

             const user = await userModel.findByEmail(requestEmail);
            console.log(user);

            const { id: userId, email, username, passwordHash }: UserServer = await userModel.findByEmail(requestEmail);

            if(!userId) return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    statusCode: res.statusCode,
                    message: ServerMessages.INCORRECT_USER_DATA
                });
            
            const isPasswordValid = await userModel.verifyPassword(password, passwordHash);

            

            if (!isPasswordValid) return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    StatusCode: res.statusCode,
                    message: ServerMessages.INCORRECT_USER_DATA,
                });

            const accessToken = generateToken(
                { userId: userId, email: email, username: username, tokenType: 'access' },
                process.env.ACCESS_JWT_SECRET!,
                ACCES_TOKEN_EXPIRING
            );

            const refreshToken = generateToken(
                { userId: userId, email: email, username: username, tokenType: 'refresh' },
                process.env.REFRESH_JWT_SECRET!,
                REFRESH_TOKEN_EXPIRING
            );

            const expiresAt = addDays(new Date, 7);

            await refreshTokenModel.create({
                userId: userId,
                token: refreshToken,
                userAgent: deviceInfo,
                ipAddress: ip,
                expiresAt: expiresAt,
            });

            res.status(StatusCodes.OK).json({
                statusCode: res.statusCode,
                message: ServerMessages.LOGIN_SUCCESS,
                data: {
                    id: userId,
                    user: username,
                    email: email,
                },
                accessToken: accessToken,
            });
        } catch(err) {
            next(err);
        }
    };
}

export const authContoller = new AuthController();