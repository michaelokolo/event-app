import { Request, Response, NextFunction } from 'express';
export default async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}
