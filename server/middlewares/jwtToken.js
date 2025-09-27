import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const sendToken = (user, statusCode, res, token) => {
  if (!token) {
    token = user.getJWT();
  }

  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: isProduction ? new URL(process.env.FRONTEND_URL).hostname : undefined,
  };

  console.log("Generated token:", token);
  console.log("Cookie options:", options);

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      token, // Include token in response body
    });
};