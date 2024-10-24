import express from 'express'
import { getUserDetails } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';
export const userRouter=express.Router();

userRouter.get('/me',isAuthenticated,getUserDetails)