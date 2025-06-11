import { CustomError } from './CustomError';

export class UnauthorizedError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 401, details);
  }
}
