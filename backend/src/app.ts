import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../config.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

export default app;
