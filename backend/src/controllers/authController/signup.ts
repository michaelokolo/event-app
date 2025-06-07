import { Request, Response, NextFunction } from 'express';
import createUserPrisma from '../../utils/db/createUserPrisma';

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


    //Generate a JWT token for the new user
    
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}
