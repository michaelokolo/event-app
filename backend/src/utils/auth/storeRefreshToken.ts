import { updateUserPrisma } from '../db/updateUserPrisma';

export async function storeRefreshToken(userId: string, refreshToken: string) {
  try {
    await updateUserPrisma(userId, { refreshToken });
  } catch (error) {
    throw error;
  }
}
