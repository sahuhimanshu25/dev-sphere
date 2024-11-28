import express from 'express'
import { addMessage, getMessages } from '../controllers/messageController.js';
import { isAuthenticated } from '../middlewares/auth.js';
export const messageRoute=express.Router();


messageRoute.post('/',isAuthenticated,addMessage)
messageRoute.get('/:chatId',isAuthenticated,getMessages)