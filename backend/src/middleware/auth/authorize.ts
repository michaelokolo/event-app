import { Response, Request, NextFunction } from 'express';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { AuthenticatedRequest } from './authenticate';
import { Role } from '../../../generated/prisma';
import logger from '../../utils/logger';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Authorization failed: No authenticated user found');
      throw new ForbiddenError('User not authenticated');
    }
    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      logger.warn(
        `Authorization failed: User ID ${req.user.id} with role '${userRole}' attempted restricted access`
      );
      throw new ForbiddenError(
        'You do not have permission to perform this action'
      );
    }
    next();
  };
}
