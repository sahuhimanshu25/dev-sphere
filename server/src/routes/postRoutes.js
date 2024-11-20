import express from 'express';
import { createPost, getFeedPosts, likePost,deletePost } from '../controllers/postController.js';
import { createComment, getComments, deleteComment } from '../controllers/commentController.js'; // Import comment controller functions
import { isAuthenticated } from '../middlewares/auth.js';
import { upload } from "../middlewares/multer.js";

export const postRouter = express.Router();


postRouter.post('/post', isAuthenticated, upload.fields([{ name: "image", maxCount: 3 }, { name: "video", maxCount: 2 }]),createPost);
postRouter.get('/posts/feed',isAuthenticated,getFeedPosts);
postRouter.put('/post/like/:id',isAuthenticated,likePost);
postRouter.post('/post/:id/comment',isAuthenticated,createComment);
postRouter.get('/post/:id/comments', isAuthenticated, getComments);
postRouter.delete('/post/:postId/comment/:commentId', isAuthenticated, deleteComment);
postRouter.delete('/post/:postId/comment/:commentId', isAuthenticated, deleteComment);
postRouter.delete('/post/:postId', isAuthenticated, deletePost);
