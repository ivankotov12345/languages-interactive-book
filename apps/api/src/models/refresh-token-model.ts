import crypto from 'crypto';

import { db } from '#root/database';
import { CreateRefreshTokenType } from '#root/types/token-types';


class RefreshTokenModel {
    create = async ({ userId, token, userAgent, ipAddress, expiresAt }: CreateRefreshTokenType) => {

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        const dbQuery = `
            INSERT INTO refresh_tokens
            (user_id, token_hash, user_agent, ip_address, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        return await db.one(dbQuery, [userId, tokenHash, userAgent, ipAddress, expiresAt]);
    };
}

export const refreshTokenModel = new RefreshTokenModel();