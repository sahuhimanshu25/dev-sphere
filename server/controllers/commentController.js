import { Post } from "../models/postModel.js";
import { Comment } from "../models/comments.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createComment = AsyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const comment = await Comment.create({
    content,
    post: postId,
    owner: req.user.id, // The user who is commenting
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});


export const getComments = AsyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }


  const comments = await Comment.find({ post: postId })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const deleteComment = AsyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  if (comment.owner.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not authorized to delete this comment", 403)
    );
  }

  await Comment.deleteOne({ _id: commentId });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
