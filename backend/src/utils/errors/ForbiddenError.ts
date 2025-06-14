import { CustomError } from './CustomError';

export class ForbiddenError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 403, details);
  }
}
