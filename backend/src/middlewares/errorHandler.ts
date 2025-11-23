import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';
import { Request, Response, NextFunction } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
