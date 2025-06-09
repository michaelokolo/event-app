import { Request, Response, NextFunction } from 'express';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { ValidationError } from '../../utils/errors/ValidationError';

export default function userLoginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    next(new ValidationError('Validation Error', errors));
    return;
  }
  next();
}
