export const sendToken = (user, statusCode, res) => {
    const token = user.getJWT();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Optional: Helps prevent CSRF attacks
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user,
    });
};
