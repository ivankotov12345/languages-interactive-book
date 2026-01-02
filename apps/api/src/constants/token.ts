import { SignOptions } from 'jsonwebtoken';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const ACCES_TOKEN_EXPIRING: SignOptions['expiresIn'] = '15m';
export const REFRESH_TOKEN_EXPIRING: SignOptions['expiresIn'] = '7d';
export const REFRESH_TOKEN_EXPIRING_DAYS_NUMBER = 7;
