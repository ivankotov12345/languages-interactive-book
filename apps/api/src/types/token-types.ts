import { SignOptions } from 'jsonwebtoken';

export type CreateAccessTokenData = {
    userId: string;
    token: string;
    expiresIn: SignOptions['expiresIn'];
};

export type CreateRefreshTokenType = {
    userId: string;
    token: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
};
