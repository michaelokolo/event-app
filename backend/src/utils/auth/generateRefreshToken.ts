import jwt from 'jsonwebtoken';
import { ConfigurationError } from '../errors/ConfigurationError';
import { User } from '../../../generated/prisma';

export function generateRefreshToken(userId: User['id']): string {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET)
    throw new ConfigurationError('JWT_SECRET environment variable is required');

  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: '7d' });
}
