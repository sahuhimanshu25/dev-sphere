import express from 'express'
import { loginUser, logout, registerUser } from '../controllers/userController.js';
export const expressRouter=express.Router();

expressRouter.post('/register',registerUser)
expressRouter.post('/login',loginUser)
expressRouter.get('/logout',logout)