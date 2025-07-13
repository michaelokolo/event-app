import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { deleteUserWithAuthorization } from '../../services/user/deleteUserWithAuthorization';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';

export default async function deleteCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    logger.warn('[Users] Unauthorized attempt to delete current user');
    throw new UnauthorizedError('You must be logged in to delete your profile');
  }

  try {
    await deleteUserWithAuthorization(userId, userId, role);
    logger.info(`[Users] User ${userId} deleted their own account`);
    res.status(204).send();
  } catch (error) {
    logger.error(`[Users] Failed to delete user ${userId}`, { error });
    next(error);
  }
}
