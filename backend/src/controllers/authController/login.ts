import { Request, Response, NextFunction } from 'express';
import prisma from '../../utils/db/prisma';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { comparePassword } from '../../utils/auth/comparePassword';
import { generateAccessToken } from '../../utils/auth/generateAccessToken';
import { generateRefreshToken } from '../../utils/auth/generateRefreshToken';
import { storeRefreshToken } from '../../utils/auth/storeRefreshToken';

/**
 * Login controller that authenticates the user with the provided email and password.
 * If successful, it generates access and refresh tokens, stores the refresh token,
 * and sends the user data along with the access token in the response.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns {Promise<void>}
 * @throws {BadRequestError} If the credentials are invalid or the user does not exist.
 */

export default async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body.user;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const isValidPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    const accessToken = generateAccessToken(existingUser.id, existingUser.role);
    const refreshToken = generateRefreshToken(existingUser.id);

    await storeRefreshToken(existingUser.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    /// Remember to setup a viewer
    res.status(200).json({
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
        // Add other user fields as necessary
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}
