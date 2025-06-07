import { CustomError } from './CustomError';

/**
 * ConflictError.ts
 * Custom error class for handling conflict errors.
 * It extends the CustomError class to provide
 * a specific error type for situations where a conflict occurs,
 * such as when trying to create a resource that already exists.
 * @class ConflictError
 * @extends {CustomError}
 * @constructor
 * @param {string} message - Error message.
 * @param {any} [details] - Additional details about the error.
 */

export class ConflictError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 409, details);
  }
}
