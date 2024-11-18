import express from 'express'
import { getMyDetails, getRecommendedUsers, getUserDetails, loginUser,logout,registerUser, searchUser,updateAccountDetails ,verifyAccountChanges} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
export const userRouter=express.Router();
userRouter.post(
    '/register',
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    registerUser
);
userRouter.post('/login',loginUser)
userRouter.get('/logout',logout)
userRouter.get("/search-user",isAuthenticated, searchUser)
userRouter.get('/me',isAuthenticated,getMyDetails)
userRouter.post('/updateAccount',isAuthenticated,updateAccountDetails)
userRouter.post('/verification',isAuthenticated,verifyAccountChanges)
userRouter.get('/recommended-users',isAuthenticated,getRecommendedUsers)
userRouter.get('/:id',isAuthenticated,getUserDetails)