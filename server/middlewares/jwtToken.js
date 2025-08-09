import dotenv from 'dotenv'
dotenv.config();

export const sendToken = (user, statusCode, res) => {
  const token = user.getJWT();
  const isProduction=true;

  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain:isProduction?".dev-sphere.onrender.com" : undefined
  };

  console.log("Token created:", token); // Debug log
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};