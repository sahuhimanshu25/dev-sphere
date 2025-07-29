import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMessage } from "../nodemailer/mailMessage.js";
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Try to get token from cookies or Authorization header
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(
        new ErrorHandler("You need to Login to Access this Resource", 401)
      );
    }

    const decodedData = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 401));
    }

    next();
  } catch (error) {
    // In development, log full error for debugging
    if (!isProduction) {
      console.error("Auth Error:", error);
    }

    // In production, avoid leaking internal details
    const message = isProduction
      ? "Invalid or Expired Token"
      : error.message;

    return next(new ErrorHandler(message, 401));
  }
};
