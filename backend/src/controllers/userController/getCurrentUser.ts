import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';

export function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (req.user) {
    console.log(`Current user ID: ${req.user.id}`);
  }

  res.status(200).json({ message: 'I am the current user' });
}
