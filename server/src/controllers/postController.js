import { Post } from "../models/postModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import {AsyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
export const createPost = AsyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const image = req.files?.image ? req.files.image[0].path : null;
    const video = req.files?.video ? req.files.video[0].path : null;


    const contentTypesProvided = [text ? "text" : null, image ? "image" : null, video ? "video" : null].filter(Boolean);
    if (contentTypesProvided.length !== 1) {
        return res.status(400).json(new ApiResponse(400, null, "Please provide only one type of content: text, image, or video"));
    }


    let postContent = {};

    if (text) {
        postContent = { type: "text", value: text };
    } else if (image) {
        const uploadRes = await uploadOnCloudinary(image);
        postContent = { type: "image", value: uploadRes.url };
    } else if (video) {
        const uploadRes = await uploadOnCloudinary(video);
        console.log(uploadRes.duration);
        postContent = { type: "video", value: uploadRes.url };
    }
    const post = await Post.create({
        user: req.user.id,
        content: postContent,
    });

    res.status(201).json(new ApiResponse(201, post, "Posted Successfully"));
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
// Get posts from followed users
export const getFeedPosts = AsyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find({ user: { $in: req.user.following } })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));  // Only call next on error, not after response
    }
});

