import { Request, Response, NextFunction } from 'express';

//import { PrismaClient, Role } from '@prisma/client';

/**
 * Signup controller that registers the user with information given in the body of the request.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */

export default function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract user information from the request body
  const { firstName, lastName, email, password, role } = req.body;

  try {
    res.status(201).send('I am working');
  } catch (error) {
    res.status(400).json({ error });
  }
}
