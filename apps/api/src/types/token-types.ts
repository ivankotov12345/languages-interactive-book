export type AccessTokenData = {
    userId: string;
    token: string;
};

export type CreateRefreshTokenType = {
    userId: string;
    tokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
};
