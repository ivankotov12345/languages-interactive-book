import pgPromise from 'pg-promise';
import 'dotenv/config';
import {
    IClient,
    IConnectionParameters,
} from 'pg-promise/typescript/pg-subset';

export const pgp = pgPromise({
    capSQL: true,
});

export const dbConfig: Record<
    string,
    string | number | IConnectionParameters<IClient>
> = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'languages-interactive-book',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

export const db = pgp(dbConfig);
