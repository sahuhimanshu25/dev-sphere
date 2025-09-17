import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotnev from 'dotenv';

dotnev.config();
const isProduction = process.env.NODE_ENV === "production";

export const app = express();

// --- Trust proxy MUST come first ---
app.set("trust proxy", 1);

// --- CORS --- 

app.use(cors({
    origin: process.env.FRONTEND_URL, // full URL e.g: "https://myfrontend.com"
    credentials: true
}));

if (isProduction) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}


// --- JSON & Cookies ---
app.use(express.json());
app.use(cookieParser());

// --- Routers ---
import { expressRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';
import { followRouter } from './routes/followRoute.js';
import { userRouter } from './routes/userRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { messageRoute } from './routes/messageRoute.js';
import { groupRouter } from './routes/groupRoutes.js';
import { error } from './middlewares/error.js';

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/auth', expressRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use(followRouter);
app.use('/message', messageRoute);
app.use('/group', groupRouter);

// --- Error Handler ---
app.use(error);
