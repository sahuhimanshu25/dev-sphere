import dotenv from "dotenv";
dotenv.config();

export const sendToken = (user, statusCode, res) => {
  const token = user.getJWT();
  const isProduction = process.env.NODE_ENV === "production";

  console.log("NODE_ENV:", process.env.NODE_ENV);

const options = {
  expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax", // 👈 Change this
  path: "/", // 👈 Add this for consistency with clearCookie
};


  console.log("Cookie options:", options);
  console.log("Generated token:", token);

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
    });
};
