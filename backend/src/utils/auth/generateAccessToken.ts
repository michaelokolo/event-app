import jwt from 'jsonwebtoken';
import { ConfigurationError } from '../errors/ConfigurationError';
import { User } from '../../../generated/prisma';

/**
 * Generates a JWT access token for a user.
 * @param userId - The ID of the user.
 * @param role - The role of the user.
 * @return A signed JWT access token.
 */

export function generateAccessToken(
  userId: User['id'],
  role: User['role']
): string {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET)
    throw new ConfigurationError('JWT_SECRET environment variable is required');

  return jwt.sign({ userId, role }, JWT_SECRET as string, {
    expiresIn: '15m',
  });
}
