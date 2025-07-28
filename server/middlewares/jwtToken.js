export const sendToken = (user, statusCode, res) => {
    const token = user.getJWT();

    const isProduction = process.env.NODE_ENV === 'production';

    const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        httpOnly: true,
        secure: isProduction, // Only use secure cookies in production (HTTPS)
        sameSite: isProduction ? 'Strict' : 'Lax', // Strict for prod, Lax for dev
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user,
    });
};
