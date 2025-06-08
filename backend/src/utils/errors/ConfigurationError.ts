import { CustomError } from './CustomError';

export class ConfigurationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 500, details);
  }
}
