import jwt from 'jsonwebtoken';
import { ConfigurationError } from '../errors/ConfigurationError';
import { User } from '../../../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET)
  throw new ConfigurationError('JWT_SECRET environment variable is required');

export function generateAccessToken(
  userId: User['id'],
  role: User['role']
): string {
  return jwt.sign({ userId, role }, JWT_SECRET as string, {
    expiresIn: '15m',
  });
}
