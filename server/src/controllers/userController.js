import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../middlewares/jwtToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
//REGISTER
export const registerUser = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ErrorHandler("All fields are required", 400);
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ErrorHandler("Username or email already exists", 409);
  }

  // console.log(req.files);

  const avatarFile = req.files?.avatar?.[0];
  if (!avatarFile) {
    throw new ErrorHandler("Avatar file is required", 400);
  }

  // Upload avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarFile.path);
  if (!avatar) {
    throw new ErrorHandler("Error uploading avatar file", 500);
  }

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar.url,
  });

  if (!user) {
    throw new ErrorHandler(
      "Something went wrong while registering the user",
      500
    );
  }

  sendToken(user, 201, res);
});

//LOGIN
// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Enter Email and password", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or password", 401));
    }

    const isPasswordsMatch = await user.comparePassword(password);

    if (!isPasswordsMatch) {
      return next(new ErrorHandler("Invalid Email or password", 401));
    }

    // If email and password match, send token
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        error.message || "Internal Server Error",
        error.statusCode || 500
      )
    );
  }
};

//LOGOUT
export const logout = AsyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });
  res.status(200).json(new ApiResponse(200, {}, "user LoggedOut Successfully"));
});

export const searchUser = AsyncHandler(async (req, res, next) => {
  // Only add the regex filter if username query exists and is not an empty string
  const usernameQuery = req.query.username?.trim();
  const keyword = usernameQuery
    ? {
        username: {
          $regex: usernameQuery,
          $options: "i",
        },
      }
    : null;

  try {
    // If no keyword (empty username), return an error response
    if (!keyword) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Please provide a username to search"));
    }

    console.log("Keyword:", keyword); // Log the query for debugging

    // Perform the search
    const users = await User.find(keyword);
    if (!users.length) {
      return res.status(404).json(new ApiResponse(404, [], "No Users Found"));
    }
    res.status(200).json(new ApiResponse(200, users, "Users Found"));
  } catch (error) {
    console.error("Error in searchUser:", error); // Log error for debugging
    return next(error);
  }
});

//GET USER DETAILS
export const getMyDetails = AsyncHandler(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }
  const userDetails = await User.aggregate([
    { $match: { _id: req.user._id } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "user",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
      },
    },
    {
      $project: {
        password: 0,
        "followers.password": 0, 
        "followers.followers": 0, 
        "followers.following": 0, 
        "following.password": 0, 
        "following.followers": 0, 
        "following.following": 0,
      },
    },
  ]);

  if (!userDetails || userDetails.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const user = userDetails[0];
  // console.log(user);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully with posts, followers, and following"
      )
    );
});

//get randomUserDetails
export const getUserDetails = AsyncHandler(async (req, res, next) => {
  const currentUser = req.params.id;
  if (!req.user || !currentUser) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User doesn't exist"));
  }

  const userDetails = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } }, //here I used mongoose.Types because the object Id Provied in Params are in string we have to conert externally to object id of mongoose this is done by using new mongoose.Types.ObjectId
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "user",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "users", 
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
      },
    },
    {
      $project: {
        password: 0,
        "followers.password": 0, 
        "followers.followers": 0, 
        "followers.following": 0, 
        "following.password": 0, 
        "following.followers": 0, 
        "following.following": 0,
      },
    },
  ]);

  const userdata = userDetails[0];
  if (!userdata) {
    return res.status(404).json(new ApiResponse(404, null, "User doesn't exist"));
  }
  res.status(200).json(new ApiResponse(200, { userdata, currentUser }, "User profile fetched successfully"));
});