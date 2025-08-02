import { Response, Request, NextFunction } from 'express';
import logger from '../../utils/logger';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';

export default async function reviewApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  res.status(200).json('Application reviewed successfully');
}
