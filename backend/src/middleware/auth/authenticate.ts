import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { Role } from '../../../generated/prisma';
import logger from '../../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`[Auth] No authorization header provided - IP: ${req.ip}`);
    throw new UnauthorizedError('No authorization header provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: Role;
    };

    req.user = { id: decoded.userId, role: decoded.role };

    logger.info(
      `[Auth] Authenticated user: ${decoded.userId}, role: ${decoded.role}, IP: ${req.ip}`
    );

    next();
  } catch (error) {
    logger.warn(
      `[Auth] Invalid or expired token - IP: ${req.ip}, error: ${error}`
    );
    throw new UnauthorizedError('Access token is invalid or expired');
  }
}
