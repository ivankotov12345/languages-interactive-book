import { db } from '#root/database';
import { CreateRefreshTokenType } from '#root/types/token-types';

class RefreshTokenModel {
    create = async ({
        userId,
        tokenHash,
        userAgent,
        ipAddress,
        expiresAt,
    }: CreateRefreshTokenType) => {
        const dbQuery = `
            INSERT INTO refresh_tokens
            (user_id, token_hash, user_agent, ip_address, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        return await db.one(dbQuery, [
            userId,
            tokenHash,
            userAgent,
            ipAddress,
            expiresAt,
        ]);
    };

    revokeToken = async (tokenHash: string) => {
        const dbQuery = `UPDATE refresh_tokens
            SET is_revoked = true
            WHERE token_hash = $1`;

        return await db.none(dbQuery, [tokenHash]);
    };

    revokeUserTokens = async (userId: string) => {
        const dbQuery = `UPDATE refresh_tokens
            SET is_revoked = true
            WHERE user_id = $1 AND NOT is_revoked`;

        return await db.none(dbQuery, [userId]);
    };
}

export const refreshTokenModel = new RefreshTokenModel();
