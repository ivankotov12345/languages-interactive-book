import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import { authRouter } from './routes/auth-routes';

import { RouterPaths } from '#constants';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 3001;
const MESSAGE = `server running on port ${PORT}`;

const app = express();

app.use(express.json());

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
}));

app.get(RouterPaths.HEALTH, (_, res) => {
    res.json({
        status: 'OK',
        message: MESSAGE
    });
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(MESSAGE);
});