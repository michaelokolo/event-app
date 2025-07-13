import { updateUserPrisma } from '../db/updateUserPrisma';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import logger from '../logger';
import prisma from '../db/prisma';

export async function storeRefreshToken(userId: string, refreshToken: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  } catch (error) {
    logger.error(`Failed to store refresh token for user ${userId}: ${error}`);
    throw new InternalServerError('Failed to store refresh token', error);
  }
}
