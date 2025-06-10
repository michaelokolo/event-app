import { CustomError } from './CustomError';

export class BadRequestError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
