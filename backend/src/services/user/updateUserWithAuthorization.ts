import {
  updateUserPrisma,
  UpdateUserParams,
} from '../../utils/db/user/updateUserPrisma';
import { Role } from '../../../generated/prisma';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import logger from '../../utils/logger';
import { BadRequestError } from '../../utils/errors/BadRequestError';

export async function updateUserWithAuthorization(
  currentUserId: string,
  targetUserId: string,
  role: Role,
  updateData: UpdateUserParams
) {
  if (currentUserId !== targetUserId && role !== Role.ADMIN) {
    logger.warn(
      `[Users] Unauthorized update attempt by user ${currentUserId} on user ${targetUserId}`
    );
    throw new ForbiddenError('You can only update your own profile');
  }

  // Role-based field-level control
  const allowedFields: (keyof UpdateUserParams)[] = [
    'firstName',
    'lastName',
    'email',
    'password',
  ];

  if (role === Role.ORGANIZER) {
    allowedFields.push('company');
  }

  if (role === Role.FREELANCER) {
    allowedFields.push('skills', 'bio', 'portfolio');
  }

  if (role === Role.ADMIN) {
    allowedFields.push('role', 'company', 'skills', 'bio', 'portfolio');
  }

  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) =>
      allowedFields.includes(key as keyof UpdateUserParams)
    )
  ) as UpdateUserParams;

  const forbiddenFields = Object.keys(updateData).filter(
    (key) => !allowedFields.includes(key as keyof UpdateUserParams)
  );

  if (forbiddenFields.length > 0) {
    logger.warn(
      `[Users] User with role ${role} attempted to update forbidden fields: ${forbiddenFields.join(
        ', '
      )}`
    );
  }

  if (Object.keys(filteredData).length === 0) {
    logger.warn(
      `[Users] User ${currentUserId} attempted to update user ${targetUserId} with no valid fields`
    );
    throw new BadRequestError('No valid fields to update');
  }

  const updatedUser = updateUserPrisma(targetUserId, filteredData);

  logger.info(
    `[Users] User ${currentUserId} successfully updated user ${targetUserId}`
  );
  return updatedUser;
}
