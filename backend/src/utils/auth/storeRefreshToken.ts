import { updateUserPrisma } from '../db/updateUserPrisma';
import { InternalServerError } from '../../utils/errors/InternalServerError';

export async function storeRefreshToken(userId: string, refreshToken: string) {
  try {
    await updateUserPrisma(userId, { refreshToken });
  } catch (error) {
    throw new InternalServerError('Failed to store refresh token', error);
  }
}
