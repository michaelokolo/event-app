import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import prisma from '../../utils/db/prisma';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import userViewer from '../../view/userViewer';
import logger from '../../utils/logger';

export default async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    logger.warn('[Users] Unauthorized access attempt to get current user');
    throw new UnauthorizedError('User not authenticated');
  }

  const userId = req.user.id;
  logger.info(`[Users] Fetching current user with ID: ${userId}`);
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      logger.warn(`[Users] Current user not found in database. ID: ${userId}`);
      throw new NotFoundError('User not found');
    }

    logger.info(
      `[Users] Current user fetched successfully: ${user.email} (ID: ${user.id})`
    );
    const userView = userViewer(user);
    res.status(200).json(userView);
  } catch (error) {
    logger.error(
      `[Users] Error fetching current user with ID ${userId}: ${error}`
    );
    next(error);
  }
}
