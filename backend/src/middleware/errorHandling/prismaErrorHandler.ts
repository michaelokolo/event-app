import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import logger from '../../utils/logger';

/**
 * Prisma error handler middleware for Express applications.
 * It catches Prisma-specific errors and sends a standardized error response.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * This middleware handles specific Prisma errors such as:
 * - P2002: Unique constraint failed
 * - P2025: Record to update not found
 * - P2003: Foreign key constraint failed
 * It returns a JSON response with the error code and message.
 * If the error is not a known Prisma error, it passes the error to the next middleware.
 */

export default async function prismaErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof PrismaClientKnownRequestError) {
    const requestInfo = `(${req.method}) ${req.originalUrl} - IP: ${req.ip}`;

    switch (err.code) {
      case 'P2002': {
        const message = `Unique constraint failed on ${err.meta?.target}`;
        logger.warn(`[Prisma P2002] ${message} - ${requestInfo}`);
        res.status(409).json({
          error: {
            message: err.message,
            details: err.meta?.target
              ? `Target: ${err.meta.target}`
              : undefined,
          },
        });
        return;
      }

      case 'P2025': {
        const message = `Record not found during update/delete on ${err.meta?.target}`;
        logger.warn(`[Prisma P2025] ${message} - ${requestInfo}`);
        res.status(404).json({
          error: {
            message: err.message,
            details: err.meta?.target
              ? `Target: ${err.meta.target}`
              : undefined,
          },
        });
        return;
      }

      case 'P2003': {
        const message = `Foreign key constraint failed on ${err.meta?.target}`;
        logger.warn(`[Prisma P2003] ${message} - ${requestInfo}`);
        res.status(400).json({
          error: {
            message: err.message,
            details: err.meta?.target
              ? `Target: ${err.meta.target}`
              : undefined,
          },
        });
        return;
      }

      default: {
        logger.warn(`[Prisma Unknown] ${err.message} - ${requestInfo}`);
        res.status(500).json({
          error: {
            message: 'Prisma error',
            details: err.message,
          },
        });
        return;
      }
    }
  }

  next(err); // Pass the error to the next middleware if it's not a Prisma error
}
