import { Request, Response, NextFunction } from 'express';

export function listUsers(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ message: 'I am an ADMIN, I can list users!' });
}
