import prisma from './prisma';
import { Role } from '../../../generated/prisma';
import { hashPassword } from '../auth/hashPassword';
import { ConflictError } from '../errors/ConflictError';

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
  refreshToken?: string | null;
  company?: string | null;
  skills?: string[];
  bio?: string | null;
  portfolio?: string | null;
}

export async function updateUserPrisma(
  userId: string,
  updateData: UpdateUserParams
): Promise<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}> {
  if (updateData.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: updateData.email },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError('Email is already registered');
    }
  }

  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        refreshToken:
          updateData.refreshToken === undefined
            ? undefined
            : updateData.refreshToken,
        company:
          updateData.company === undefined ? undefined : updateData.company,
        bio: updateData.bio === undefined ? undefined : updateData.bio,
        portfolio:
          updateData.portfolio === undefined ? undefined : updateData.portfolio,
        skills: updateData.skills === undefined ? undefined : updateData.skills,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}
