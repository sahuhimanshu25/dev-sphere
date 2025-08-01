import dotenv from 'dotenv'
dotenv.config();

export const sendToken = (user, statusCode, res) => {
  const token = user.getJWT();

  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for cross-origin in production
    path: '/', // Ensure cookie is available for all routes
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
  });
};