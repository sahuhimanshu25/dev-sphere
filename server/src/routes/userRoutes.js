import express from 'express'
import { getUserDetails, loginUser,logout,registerUser, searchUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

export const userRouter=express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',logout)
userRouter.get('/me',isAuthenticated,getUserDetails)
userRouter.get("/search-user/:username", searchUser)