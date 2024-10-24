
import express from 'express'
import cookieParser from 'cookie-parser';
export const app=express();
import { expressRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';
import { followRouter } from './routes/followRoute.js';
import { userRouter } from './routes/userRoutes.js';
app.use(express.json())
app.use(cookieParser())


app.use('/auth',expressRouter);
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use(followRouter);