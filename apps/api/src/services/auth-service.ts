import { addDays } from 'date-fns';

import { UserServer } from '@repo/types';

import { ServerMessages } from '#constants';
import { ACCES_TOKEN_EXPIRING, REFRESH_TOKEN_EXPIRING } from '#root/constants/token';
import { refreshTokenModel } from '#root/models/refresh-token-model';
import { userModel } from '#root/models/user-model';
import { generateToken } from '#root/utils/token';

class AuthService {
    login = async (requestEmail: string, password: string, deviceInfo?: string, ip?: string) => {
        const { id: userId, email, username, passwordHash }: UserServer = await userModel.findByEmail(requestEmail);

        if (!userId) throw new Error(ServerMessages.INCORRECT_USER_DATA);

        const isPasswordValid = await userModel.verifyPassword(password, passwordHash);

        if (!isPasswordValid) throw new Error(ServerMessages.INCORRECT_USER_DATA);

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

        return {
            user: {
                id: userId,
                username: username,
                email: email,
            },
            accessToken,
            refreshToken,
        };
    };
}

export const authService = new AuthService();