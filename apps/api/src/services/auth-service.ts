import bcrypt from 'bcryptjs';
import { addDays } from 'date-fns';
import createError from 'http-errors';

import { UserServer, UserWithPassword } from '@repo/types';

import { ServerMessages, StatusCodes } from '#constants';
import {
    ACCES_TOKEN_EXPIRING,
    REFRESH_TOKEN_EXPIRING,
} from '#root/constants/token';
import { refreshTokenModel } from '#root/models/refresh-token-model';
import { userModel } from '#root/models/user-model';
import { createTokenHash, generateToken } from '#root/utils/token';

class AuthService {
    register = async ({
        email,
        username,
        firstName,
        lastName,
        password,
    }: UserWithPassword<'password'>) => {
        const isEmailExists = await userModel.findByEmail(email);
        const isUsernameExists = await userModel.findByUsername(username);

        if (isEmailExists || isUsernameExists)
            throw createError(StatusCodes.CONFLICT, ServerMessages.USER_EXISTS);

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await userModel.createUser({
            email,
            username,
            firstName,
            lastName,
            passwordHash,
        });
    };

    login = async (
        requestEmail: string,
        password: string,
        deviceInfo?: string,
        ip?: string,
    ) => {
        const {
            id: userId,
            email,
            username,
            passwordHash,
        }: UserServer = await userModel.findByEmail(requestEmail);

        const isPasswordValid = await userModel.verifyPassword(
            password,
            passwordHash,
        );

        if (!userId || !isPasswordValid)
            throw createError(
                StatusCodes.UNAUTHORIZED,
                ServerMessages.INCORRECT_USER_DATA,
            );

        const accessToken = generateToken(
            {
                userId: userId,
                email: email,
                username: username,
                tokenType: 'access',
            },
            process.env.ACCESS_JWT_SECRET!,
            ACCES_TOKEN_EXPIRING,
        );

        const refreshToken = generateToken(
            {
                userId: userId,
                email: email,
                username: username,
                tokenType: 'refresh',
            },
            process.env.REFRESH_JWT_SECRET!,
            REFRESH_TOKEN_EXPIRING,
        );

        const refreshTokenHash = createTokenHash(refreshToken);

        const expiresAt = addDays(new Date(), 7);

        await refreshTokenModel.create({
            userId: userId,
            tokenHash: refreshTokenHash,
            userAgent: deviceInfo,
            ipAddress: ip,
            expiresAt: expiresAt,
        });

        await refreshTokenModel.cleanupOldTokens(userId);

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

    logout = async (userId: string, token?: string) => {
        if (token) {
            const tokenHash = createTokenHash(token);
            await refreshTokenModel.revokeToken(tokenHash);
        } else {
            await refreshTokenModel.revokeUserTokens(userId);
        }
    };
}

export const authService = new AuthService();
