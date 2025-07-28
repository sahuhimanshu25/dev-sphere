import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

export const app = express();

import { expressRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';
import { followRouter } from './routes/followRoute.js';
import { userRouter } from './routes/userRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { error } from './middlewares/error.js';
import { messageRoute } from './routes/messageRoute.js';
import { groupRouter } from './routes/groupRoutes.js';

const isProduction = process.env.NODE_ENV === 'production';

// --- CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// --- Session (production & dev friendly) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'devSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // true in production (HTTPS), false in dev (HTTP)
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax', // for cross-site cookies
    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
  }
}));

// --- Basic Route ---
app.get("/", (req, res) => {
  res.send("Hello World");
});

// --- Routers ---
app.use('/auth', expressRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use(followRouter);
app.use('/message', messageRoute);
app.use('/group', groupRouter);

// --- Error Handler ---
app.use(error);
