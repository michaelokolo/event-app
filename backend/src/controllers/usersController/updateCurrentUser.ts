import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';

export default async function updateCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {}
