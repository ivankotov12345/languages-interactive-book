import jwt, { SignOptions } from 'jsonwebtoken';

import { User } from '@repo/types';

type TokenPayload = Omit<
    User,
    'id' | 'firstName' | 'lastName' | 'createdAt'
> & { userId: string; tokenType: 'access' | 'refresh' };

export const generateToken = (
    payload: TokenPayload,
    jwtSecret: string,
    expiresIn: SignOptions['expiresIn'],
) => jwt.sign({ ...payload }, jwtSecret, { expiresIn: expiresIn });
