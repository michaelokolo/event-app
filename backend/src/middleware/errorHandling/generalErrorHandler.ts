import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils/errors/CustomError';
import logger from '../../utils/logger';

/**
 * General error handler middleware for Express applications.
 * It catches errors thrown in the application and sends a standardized error response.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */

export default function generalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestInfo = `(${req.method}) ${req.originalUrl} - IP: ${req.ip}`;

  if (err instanceof CustomError) {
    logger.warn(
      `Handled Error: ${err.message} - Status: ${err.statusCode} - ${requestInfo}`
    );
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  } else {
    logger.error(
      `Unhandled Error: ${err.message} - Stack: ${err.stack} - ${requestInfo}`
    );
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
      },
    });
  }
}
