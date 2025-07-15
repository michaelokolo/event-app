import prisma from '../prisma';
import { Role } from '../../../../generated/prisma';
import { hashPassword } from '../../auth/hashPassword';
import { ConflictError } from '../../errors/ConflictError';
import { InternalServerError } from '../../errors/InternalServerError';
import logger from '../../logger';

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  password?: string;
  company?: string | null;
  skills?: string[];
  bio?: string | null;
  portfolio?: string | null;
}

export async function updateUserPrisma(
  userId: string,
  updateData: UpdateUserParams
) {
  if (Object.keys(updateData).length === 0) {
    logger.warn(
      `[Users] Update attempted for user ${userId} with no valid fields`
    );
  }

  if (updateData.email) {
    logger.warn(
      `[Users] User ${userId} is attempting to update email to ${updateData.email}`
    );
    const existingUser = await prisma.user.findUnique({
      where: { email: updateData.email },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      logger.warn(
        `[Users] Email ${updateData.email} is already registered by another user`
      );
      throw new ConflictError('Email is already registered');
    }
  }

  if (updateData.password) {
    logger.info(`[Users] User ${userId} is updating their password`);
    updateData.password = await hashPassword(updateData.password);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    logger.info('[Users] User updated successfully', {
      userId,
      updatedFields: Object.keys(updateData),
    });
    return updatedUser;
  } catch (error) {
    logger.error('[Users] Failed to update user', {
      error,
      userId,
      updateData: {
        ...updateData,
        password: updateData.password ? '[PROTECTED]' : undefined,
      },
    });
    throw new InternalServerError('Failed to update user', error);
  }
}
