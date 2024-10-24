import express from 'express'
import { loginUser, logout, registerUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';
export const expressRouter=express.Router();

expressRouter.post('/register',registerUser)
expressRouter.post('/login',loginUser)
expressRouter.get('/logout',isAuthenticated,logout)