import { Role } from '../../../generated/prisma';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { deleteUserPrisma } from '../../utils/db/user/deleteUserPrisma';
import logger from '../../utils/logger';

export async function deleteUserWithAuthorization(
  currentUserId: string,
  targetUserId: string,
  role: Role
) {
  if (currentUserId !== targetUserId && role !== Role.ADMIN) {
    logger.warn(
      `[Users] Unauthorized delete attempt by user ${currentUserId} on user ${targetUserId}`
    );
    throw new ForbiddenError('You can only delete your own account');
  }

  logger.info(
    `[Users] User ${currentUserId} authorized to delete user ${targetUserId}`
  );
  await deleteUserPrisma(targetUserId);
}
