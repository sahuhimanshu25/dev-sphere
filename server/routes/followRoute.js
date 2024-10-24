import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptFollowRequest, declineFollowRequest, followUser, unfollowUser } from '../controllers/followController.js';
export const followRouter=express.Router();

followRouter.put('/follow/:id',isAuthenticated,followUser);
followRouter.put('/unfollow/:id',isAuthenticated,unfollowUser);
// followRouter.put('/follow-request/accept/:requestId',isAuthenticated,acceptFollowRequest);
// followRouter.put('/follow-request/decline/:requestId',isAuthenticated,declineFollowRequest);
