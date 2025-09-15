export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      statusCode === 400
        ? "Bad Request"
        : statusCode === 401
        ? "Unauthorized"
        : statusCode === 403
        ? "Forbidden"
        : statusCode === 404
        ? "Not Found"
        : statusCode === 500
        ? "Internal Server Error"
        : "Error";
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
