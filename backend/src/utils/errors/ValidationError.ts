import { CustomError } from './CustomError';

/**
 * ValidationError.ts
 * Custom error class for validation errors.
 * It extends the CustomError class to provide
 * a specific error type for validation issues.
 * @class ValidationError
 * @extends {CustomError}
 * @constructor
 * @param {string} message - Error message.
 * @param {any} [details] - Additional details about the error.
 *
 */

export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
