import { NextFunction, Request, Response } from 'express';
import { isAllowedSignupRole } from '../../utils/validateUserRole';
import { ValidationError } from '../../utils/types';
import { validatePassword } from '../../utils/validatePassword';
import { validateEmail } from '../../utils/validateEmail';

// if (!isAllowedSignupRole(role)) {
// }

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
  const errors: ValidationError = {};
  errors.body = [];

  if (!req.body) {
    errors.body.push('cannot be empty');
    res.status(400).json({ errors });
    return;
  }

  const { user } = req.body;

  if (!user) {
    errors.body.push('user object must be provided');
    res.status(400).json({ errors });
    return;
  }

  const { email, password, firstName, lastName, role } = user;

  if (!role) {
    errors.body.push('role must be provided');
    res.status(400).json({ errors });
    return;
  }

  if (!isAllowedSignupRole(role)) {
    errors.body.push('role is not allowed for signup');
    res.status(400).json({ errors });
    return;
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    errors.body.push(...passwordErrors);
  }

  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) {
    errors.body.push(...emailErrors);
  }

  if (!firstName) {
    errors.body.push('firstName must be provided');
  } else if (firstName && typeof firstName !== 'string') {
    errors.body.push('firstName must be a string');
  }

  if (!lastName) {
    errors.body.push('lastName must be provided');
  } else if (lastName && typeof lastName !== 'string') {
    errors.body.push('firstName must be a string');
  }

  if (errors.body.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
