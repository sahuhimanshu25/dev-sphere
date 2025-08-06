import ErrorHandler from "../utils/errorHandler.js";

export const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle MongoDB CastError
  if (err.name === "CastError") {
    const message = `Resource Not Found! Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, 400);
  }

  console.error("Error Details:", {
    message: err.message,
    statusCode: err.statusCode,
    value: err.value, // Log invalid value for CastError
    stack: err.stack,
  });

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};