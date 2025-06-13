import prisma from './prisma';
import { Role } from '../../../generated/prisma';
import { hashPassword } from '../auth/hashPassword';
import { ConflictError } from '../errors/ConflictError';
import { InternalServerError } from '../../utils/errors/InternalServerError';

/**
 * Creates a new user in the database using Prisma.
 * @param {CreateUserParams} params - The parameters for creating a user.
 * @param {string} params.firstName - The first name of the user.
 * @param {string} params.lastName - The last name of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.password - The password of the user.
 * @param {Role} params.role - The role of the user.
 * @returns {Promise<{ id: string; firstName: string; lastName: string; email: string; role: Role }>} - The created user object.
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
}: CreateUserParams): Promise<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}> {
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
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Database error while creating user:', error);
    throw new InternalServerError('Failed to create user', error);
  }
}
