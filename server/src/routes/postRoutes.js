import express from 'express'
import { createPost, getFeedPosts, likePost } from '../controllers/postController.js';
export const postRouter=express.Router();
import { isAuthenticated } from '../middlewares/auth.js';
import {upload} from "../middlewares/multer.js"


postRouter.post('/post', isAuthenticated,upload.fields([{ name: "image", maxCount: 3 }, { name: "video", maxCount: 2 }])
,createPost);
postRouter.put('/post/like/:id', isAuthenticated, likePost);
postRouter.get('/posts/feed', isAuthenticated, getFeedPosts);