import { CustomError } from './CustomError';

export class InternalServerError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 500, details);
  }
}
