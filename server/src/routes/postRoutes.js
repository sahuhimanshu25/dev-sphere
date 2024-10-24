import express from 'express'
import { createPost, getFeedPosts, likePost } from '../controllers/postController.js';
export const postRouter=express.Router();
import { isAuthenticated } from '../middlewares/auth.js';


postRouter.post('/post', isAuthenticated, createPost);
postRouter.put('/post/like/:id', isAuthenticated, likePost);
postRouter.get('/posts/feed', isAuthenticated, getFeedPosts);