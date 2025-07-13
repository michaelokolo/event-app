import prisma from './prisma';
import logger from '../logger';
import { InternalServerError } from '../errors/InternalServerError';

export async function deleteUserPrisma(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    logger.info(`[Users] Successfully deleted user ${userId}`);
  } catch (error) {
    logger.error(`[Users] Failed to delete user ${userId}`, { error });
    throw new InternalServerError('Failed to delete user');
  }
}
