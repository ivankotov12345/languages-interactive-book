import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import { RouterPaths } from '#constants';
import { errorHandler, notFoundHandler } from '#middleware/error-handler';
import { authRouter } from '#routes/auth-routes';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 3001;
const MESSAGE = `server running on port ${PORT}`;

const app = express();

app.use(express.json());

app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type'],
    })
);

app.get(RouterPaths.HEALTH, (_, res) => {
    res.json({
        status: 'OK',
        message: MESSAGE,
        nodeenv: process.env.NODE_ENV,
    });
});

app.use(RouterPaths.AUTH, authRouter);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
    console.log(MESSAGE);
});
