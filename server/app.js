import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

export const app = express();

// Trust proxy MUST come first
app.set("trust proxy", 1);

// CORS 
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Incoming cookies:", req.cookies);
  console.log("Incoming headers:", req.headers.authorization);
  next();
});
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

if (isProduction) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// JSON & Cookies
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// API routes
import { expressRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';
import { followRouter } from './routes/followRoute.js';
import { userRouter } from './routes/userRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { messageRoute } from './routes/messageRoute.js';
import { groupRouter } from './routes/groupRoutes.js';
import { error } from './middlewares/error.js';

app.get("/api", (req, res) => {
    res.send("Hello World");
});

app.use('/auth', expressRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use(followRouter);
app.use('/message', messageRoute);
app.use('/group', groupRouter);

// Handle unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use(error);