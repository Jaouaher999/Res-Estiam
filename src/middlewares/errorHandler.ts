import { Request, Response } from "express";

const errorHandler = (err: any, _req: Request, res: Response) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handling MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    err.message = `Duplicate Key Error: ${Object.keys(err.keyValue)} already exists`;
  }

  // Send Detailed Error Response
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorMessages: err.errors
      ? Object.values(err.errors).map((error: any) => ({
          path: error.path,
          message: error.message,
        }))
      : [],
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;
