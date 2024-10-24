import { Post } from "../models/postModel.js";
import {ErrorHandler} from "../utils/errorHandler.js";
import {AsyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
// Create a post
export const createPost =AsyncHandler(async (req, res, next) => {
        const { content } = req.body;

        const post = await Post.create({
            user: req.user.id,
            content
        });
        res.status(201).json(new ApiResponse(201,post,"Posted Successfully"))
});

// Like/Unlike a post
export const likePost =AsyncHandler(async (req, res, next) => {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }

        const likedIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);

        if (likedIndex === -1) {
            // Like the post
            post.likes.push({ user: req.user.id });
        } else {
            // Unlike the post
            post.likes.splice(likedIndex, 1);
        }
        await post.save();
        res.status(200).json(new ApiResponse(200,{likes:post.likes.length},"likes Fetched Successfully"))
});

// Get posts from followed users
export const getFeedPosts =AsyncHandler(async (req, res, next) => {
        const posts = await Post.find({ user: { $in: req.user.following } })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
        return next(new ErrorHandler(error.message, 500));
});
