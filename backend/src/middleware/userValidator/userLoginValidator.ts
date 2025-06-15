import { Request, Response, NextFunction } from 'express';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { ValidationError } from '../../utils/errors/ValidationError';
import logger from '../../utils/logger';

/**
 * Middleware to validate user login request.
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @throws {ValidationError} If validation fails, it passes an error to the next middleware.
 * @returns {void} Calls next middleware if validation passes.
 */

export default function userLoginValidator(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = [];
  const { user } = req.body || {};

  if (!user) {
    errors.push('User object must be provided.');
  } else {
    const { email, password } = user;

    errors.push(...validateEmail(email));

    errors.push(...validatePassword(password));
  }

  if (errors.length) {
    logger.warn(
      `Validation failed during login - IP: ${req.ip}, Errors: ${errors.join(
        '; '
      )}`
    );
    next(new ValidationError('Validation Error', errors));
    return;
  }
  next();
}
