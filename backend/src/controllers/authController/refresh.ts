import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/db/prisma';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import logger from '../../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      logger.warn('[Auth] Refresh token missing in request');
      throw new UnauthorizedError('No refresh token provided');
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET as string) as {
        userId: string;
      };
      logger.info(
        `[Auth] Refresh token verified for user ID: ${payload.userId}`
      );
    } catch (error) {
      logger.warn('[Auth] Invalid refresh token', error);
      throw new UnauthorizedError('Invalid refresh token', error);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      logger.warn(
        `[Auth] Refresh token not found or revoked for user ID: ${payload.userId}`
      );
      throw new UnauthorizedError('Refresh token not found or revoked');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    logger.info(`[Auth] New access token generated for user ID: ${user.id}`);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.error(`[Auth] Refresh token error: ${error}`);
    next(error);
  }
}
