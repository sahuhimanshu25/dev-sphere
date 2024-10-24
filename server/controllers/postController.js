import { Post } from "../models/postModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a post
export const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;

        const post = await Post.create({
            user: req.user.id,
            content
        });

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Like/Unlike a post
export const likePost = async (req, res, next) => {
    try {
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

        res.status(200).json({
            success: true,
            likes: post.likes.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Get posts from followed users
export const getFeedPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: { $in: req.user.following } })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
