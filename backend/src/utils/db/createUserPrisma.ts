import prisma from './prisma';
import { Role } from '../../../generated/prisma';
import { hashPassword } from '../auth/hashPassword';
import { ConflictError } from '../errors/ConflictError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import logger from '../logger';

/**
 * Creates a new user in the database using Prisma.
 * @param {CreateUserParams} params - The parameters for creating a user.
 * @param {string} params.firstName - The first name of the user.
 * @param {string} params.lastName - The last name of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.password - The password of the user.
 * @param {Role} params.role - The role of the user.
 */

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export default async function createUserPrisma({
  firstName,
  lastName,
  email,
  password,
  role,
}: CreateUserParams) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new ConflictError('Email is already registered');
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });

    return user;
  } catch (error) {
    logger.error('Failed to create user in database', {
      error,
      email,
      firstName,
      lastName,
    });
    throw new InternalServerError('Failed to create user', error);
  }
}
