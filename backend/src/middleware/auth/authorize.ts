import { Response, Request, NextFunction } from 'express';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { AuthenticatedRequest } from './authenticate';
import { Role } from '../../../generated/prisma';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError('User not authenticated');
    }
    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        'You do not have permission to perform this action'
      );
    }
    next();
  };
}
