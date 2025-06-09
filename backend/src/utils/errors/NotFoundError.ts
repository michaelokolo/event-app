import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, details);
  }
}
