import { User } from "../models/userModel.js";
import  ErrorHandler  from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../middlewares/jwtToken.js";

//REGISTER
export const registerUser = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ErrorHandler("All fields are required",400);
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ErrorHandler("UserName or email already exists",409);
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  if (!user) {
    throw new ApiError("SomeThing went wrong while registering the user",500);
  }
  sendToken(user, 201, res);
});

//LOGIN
// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Enter Email and password",401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or password",401));
    }

    const isPasswordsMatch = await user.comparePassword(password);

    if (!isPasswordsMatch) {
      return next(new ErrorHandler("Invalid Email or password",401));
    }

    // If email and password match, send token
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler( error.message || "Internal Server Error",error.statusCode || 500));
  }
};


//LOGOUT
export const logout = AsyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });
  res.status(200).json(new ApiResponse(200,{},"user LoggedOut Successfully"))
});

//GET USER DETAILS
export const getMyDetails = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched Successfully"));
});

export const searchUser = AsyncHandler(async (req, res, next) => {
  const keyword = req.query.username
    ? {
        username: {
          $regex: req.query.username,
          $options: "i", 
        },
      }
    : {};

  try {
    const users = await User.find(keyword);
    if (users.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No Users Found"));
    }
    res.status(200).json(new ApiResponse(200, users, "Users Found"));
  } catch (error) {
    return next(error);
  }
});

export const getUserDetails = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  res
    .status(200)
    .json(new ApiResponse(200, user, " user fetched Successfully"));
});
