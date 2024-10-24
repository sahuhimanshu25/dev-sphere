import express from 'express'
export const chatRouter=express.Router()
import { isAuthenticated } from '../middlewares/auth.js'
import { createChat, findChat, userChats } from '../controllers/chatController.js'

chatRouter.post('/create',isAuthenticated,createChat);
chatRouter.get('/chats',isAuthenticated,userChats)
chatRouter.get('/:secondId',isAuthenticated,findChat)