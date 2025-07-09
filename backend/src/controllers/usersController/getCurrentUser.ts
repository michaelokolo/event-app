import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import prisma from '../../utils/db/prisma';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { NotFoundError } from '../../utils/errors/NotFoundError';

export default async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
