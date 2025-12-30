import bcrypt from 'bcryptjs';

import { UserWithPassword } from '@repo/types';

import { db } from '#root/database';

class UserModel {
    createUser = async ({
        email,
        username,
        firstName,
        lastName,
        passwordHash,
    }: UserWithPassword<'passwordHash'>) => {
        const dbQuery = `
            INSERT INTO users (email, username, first_name, last_name, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING (
            	id,
            	email,
            	username,
            	first_name,
            	last_name,
            	password_hash,
            	created_at
            )`;

        return db.one(dbQuery, [
            email,
            username,
            firstName,
            lastName,
            passwordHash,
        ]);
    };

    findByEmail = async (email: string) =>
        await db.oneOrNone(
            `SELECT
            id, 
            email, 
            username, 
            password_hash as "passwordHash" 
         from users
         WHERE email = $1`,
            [email],
        );

    findByUsername = async (username: string) =>
        await db.oneOrNone(
            `SELECT
            id, 
            email, 
            username, 
            password_hash as "passwordHash" 
         from users
         WHERE username = $1`,
            [username],
        );

    verifyPassword = async (password: string, passwordHash: string) =>
        await bcrypt.compare(password, passwordHash);
}

export const userModel = new UserModel();
