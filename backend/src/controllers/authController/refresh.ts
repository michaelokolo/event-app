import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/db/prisma';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET as string) as {
        userId: string;
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token', error);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Refresh token not found or revoked');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}
