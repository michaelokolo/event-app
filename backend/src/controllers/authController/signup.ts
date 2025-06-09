import { Request, Response, NextFunction } from 'express';
import createUserPrisma from '../../utils/db/createUserPrisma';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';
import { generateRefreshToken } from '../../utils/auth/generateRefreshToken';
import { storeRefreshToken } from '../../utils/auth/storeRefreshToken';

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
    const newUser = await createUserPrisma(userData);

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    await storeRefreshToken(newUser.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remember to setup a viewer
    res.status(201).json({
      user: newUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}
