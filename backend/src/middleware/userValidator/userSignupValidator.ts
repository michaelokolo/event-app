import { NextFunction, Request, Response } from 'express';
import { validatePassword } from '../../utils/validatePassword';
import { validateEmail } from '../../utils/validateEmail';
import { validateSignupRole } from '../../utils/validateSignupRole';
import { ValidationError } from '../../utils/errors/ValidationError';
import logger from '../../utils/logger';

/**
 * This function is a middleware that validates the user information in the request body in order to log the user in.
 * If the request is malformed it responds accordingly and returns, stopping the request from going further.
 * if the request is valid it calls the next function to continue the request.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */

export default function userSignupValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: string[] = [];
  const { user } = req.body || {};

  if (!user) {
    errors.push('User object must be provided.');
  } else {
    const { email, password, firstName, lastName, role } = user;

    errors.push(...validateSignupRole(role));
    errors.push(...validatePassword(password));
    errors.push(...validateEmail(email));

    if (!firstName) {
      errors.push('First name must be provided');
    } else if (firstName && typeof firstName !== 'string') {
      errors.push('First name must be a string');
    }

    if (!lastName) {
      errors.push('Last name must be provided');
    } else if (lastName && typeof lastName !== 'string') {
      errors.push('Last name must be a string');
    }
  }

  if (errors.length) {
    logger.warn(
      `Signup validation failed - IP: ${req.ip}, Email: ${
        user?.email || 'N/A'
      }, Errors: ${errors.join('; ')}`
    );
    next(new ValidationError('Validation Error', errors));
    return;
  }
  next();
}
