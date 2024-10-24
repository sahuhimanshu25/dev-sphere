import { User } from "../models/userModel.js";
import { FollowRequest } from "../models/followRequestModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Send follow request
export const followUser = async (req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if already following
        if (loggedInUser.following.includes(userToFollow._id)) {
            return next(new ErrorHandler("You are already following this user", 400));
        }

        // Add to following of logged in user
        loggedInUser.following.push(userToFollow._id);

        // Add to followers of the user being followed
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            success: true,
            message: `You are now following ${userToFollow.username}`,
            followersCount: userToFollow.followers.length,
            followingCount: loggedInUser.following.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user.id);

        if (!userToUnfollow) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if not already following
        if (!loggedInUser.following.includes(userToUnfollow._id)) {
            return next(new ErrorHandler("You are not following this user", 400));
        }

        // Remove from following of logged in user
        loggedInUser.following = loggedInUser.following.filter(
            (followId) => followId.toString() !== userToUnfollow._id.toString()
        );

        // Remove from followers of the user being unfollowed
        userToUnfollow.followers = userToUnfollow.followers.filter(
            (followerId) => followerId.toString() !== loggedInUser._id.toString()
        );

        await loggedInUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            success: true,
            message: `You have unfollowed ${userToUnfollow.username}`,
            followersCount: userToUnfollow.followers.length,
            followingCount: loggedInUser.following.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Accept follow request
export const acceptFollowRequest = async (req, res, next) => {
    try {
        // Find the pending follow request by request ID and receiver (logged-in user)
        const followRequest = await FollowRequest.findOne({
            _id: req.params.requestId,
            receiver: req.user.id,
            status: 'pending'
        });

        if (!followRequest) {
            return next(new ErrorHandler("Follow request not found or already processed", 404));
        }

        // Mark the follow request as accepted
        followRequest.status = 'accepted';
        await followRequest.save();

        // Fetch the sender and receiver (logged-in user) from the database
        const sender = await User.findById(followRequest.sender);
        const receiver = await User.findById(req.user.id); // Fetch user from DB, don't rely on req.user

        if (!sender || !receiver) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Add sender to receiver's followers and receiver to sender's following
        if (!receiver.followers.includes(sender._id)) {
            receiver.followers.push(sender._id);
        }
        if (!sender.following.includes(receiver._id)) {
            sender.following.push(receiver._id);
        }

        // Save both users
        await receiver.save();
        await sender.save();

        res.status(200).json({
            success: true,
            message: "Follow request accepted",
            followersCount: receiver.followers.length,
            followingCount: sender.following.length
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
// Decline follow request
export const declineFollowRequest = async (req, res, next) => {
    try {
        // Find the pending follow request by request ID and receiver (logged-in user)
        const followRequest = await FollowRequest.findOne({
            _id: req.params.requestId,
            receiver: req.user.id,
            status: 'pending'
        });

        if (!followRequest) {
            return next(new ErrorHandler("Follow request not found or already processed", 404));
        }

        // Mark the follow request as declined
        followRequest.status = 'declined';
        await followRequest.save();

        res.status(200).json({
            success: true,
            message: "Follow request declined"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};