import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/db/prisma';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        error: {
          message: 'No refresh token provided',
        },
      });
      return;
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET as string) as {
        userId: string;
      };
    } catch (error) {
      res.status(401).json({
        error: {
          message: 'Invalid refresh token',
        },
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({
        error: {
          message: 'Refresh token not found or revoked',
        },
      });
      return;
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}
