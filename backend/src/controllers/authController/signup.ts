import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../../utils/hashPassword';

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
  // Extract user information from the request body
  const { firstName, lastName, email, password, role } = req.body.user;

  try {
    const hashedPassword = await hashPassword(password);

    res.status(201).send(hashedPassword);
  } catch (error) {
    res.status(400).json({ error });
  }
}
