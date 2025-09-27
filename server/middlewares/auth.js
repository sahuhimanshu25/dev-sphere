import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("----------- request hit ------------");
    console.log("Request headers:", req.headers);
    console.log("Request cookies:", req.cookies);

    const token = req.cookies?.token;

    if (!token) {
      console.error("No token found in cookies");
      return next(new ErrorHandler("You need to Login to Access this Resource", 401));
    }

    const decodedData = jwt.verify(token, JWT_SECRET);
    console.log("Decoded JWT:", decodedData);

    if (!decodedData.id || !/^[0-9a-fA-F]{24}$/.test(decodedData.id)) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });
      return next(new ErrorHandler(`Invalid user ID in token: ${decodedData.id || "undefined"}`, 400));
    }

    const user = await User.findById(decodedData.id);

    if (!user) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });
      return next(new ErrorHandler(`User not found for ID: ${decodedData.id}`, 404));
    }

    req.user = user;
    console.log("User authenticated:", user._id);
    next();
  } catch (error) {
    console.error("Auth Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    const message = isProduction ? "Invalid or Expired Token" : error.message;

    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });
    }

    return next(new ErrorHandler(message, 401));
  }
};