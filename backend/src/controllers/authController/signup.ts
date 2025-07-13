import { Request, Response, NextFunction } from 'express';
import createUserPrisma from '../../utils/db/createUserPrisma';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';
import { generateRefreshToken } from '../../utils/auth/generateRefreshToken';
import { storeRefreshToken } from '../../utils/auth/storeRefreshToken';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import logger from '../../utils/logger';
import userViewer from '../../view/userViewer';

/**
 * Signup controller that registers the user with information given in the body of the request.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */

export default async function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userData = req.body.user;

    logger.info(`[Auth] Signup attempt for email: ${userData.email}`);

    const newUser = await createUserPrisma(userData);

    if (!newUser) {
      logger.error('[Auth] User creation failed unexpectedly');
      throw new InternalServerError('User creation failed');
    }

    logger.info(`[Auth] New user created with ID: ${newUser.id}`);

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    await storeRefreshToken(newUser.id, refreshToken);
    logger.debug(`[Auth] Refresh token stored for user ID: ${newUser.id}`);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`[Auth] User ${newUser.id} signed up and tokens issued`);
    const userView = userViewer(newUser, accessToken);
    res.status(201).json(userView);
  } catch (error) {
    logger.error(`[Auth] Signup error: ${error}`);
    next(error);
  }
}
