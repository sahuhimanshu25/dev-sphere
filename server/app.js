
import express from 'express'
import cookieParser from 'cookie-parser';
export const app=express();
import { expressRouter } from './routes/authRoutes.js';
app.use(express.json())
app.use(cookieParser())


app.use('/auth',expressRouter);