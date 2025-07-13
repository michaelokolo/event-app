import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { updateUserWithAuthorization } from '../../services/user/updateUserWithAuthorization';
import userViewer from '../../view/userViewer';
import logger from '../../utils/logger';

export default async function updateCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const role = req.user?.role;
  if (!userId || !role) {
    logger.warn('[Users] Unauthorized access attempt to update current user');
    throw new UnauthorizedError('You must be logged in to update your profile');
  }

  const updateData = req.body.user;

  try {
    const updatedUser = await updateUserWithAuthorization(
      userId,
      userId,
      role,
      updateData
    );
    logger.info(`[Users] User ${userId} successfully updated their profile`);
    const userView = userViewer(updatedUser);
    res.status(200).json(userView);
  } catch (error) {
    logger.error(
      `[Users] Failed to update profile for user ${userId}: ${error}`
    );
    next(error);
  }
}
