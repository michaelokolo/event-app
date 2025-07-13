import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import prisma from '../../utils/db/prisma';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import userViewer from '../../view/userViewer';
import logger from '../../utils/logger';

export default async function getUserById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.params.id;
  if (!userId) {
    logger.warn('[Users] User ID not provided in request params');
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    logger.info(`[Users] Fetching user by ID: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.warn(`[Users] User not found for ID: ${userId}`);
      throw new NotFoundError('User not found');
    }

    logger.info(`[Users] User found: ${user.email} (ID: ${user.id})`);

    const userView = userViewer(user);
    res.status(200).json(userView);
  } catch (error) {
    logger.error(`[Users] Error fetching user by ID ${userId}: ${error}`);
    next(error);
  }
}
