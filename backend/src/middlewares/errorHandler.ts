import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
