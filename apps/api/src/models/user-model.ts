import bcrypt from 'bcryptjs';

import { UserInfo } from '@repo/types';

import { db } from '#root/database';

class UserModel {
    async createUser(userData: UserInfo & { password: string }) {
        const { email, login, firstName, lastName, password } = userData;

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const dbQuery = `
            INSERT INTO users (email, login, first_name, last_name, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING (
            	id,
            	email,
            	login,
            	first_name,
            	last_name,
            	password_hash,
            	created_at
            )`;

        return db.one(dbQuery, [email, login, firstName, lastName, passwordHash]);
    }
}

export const userModel = new UserModel();