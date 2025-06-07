/**
 * CustomError class for handling application-specific errors.
 * It extends the built-in Error class and allows for
 * custom status codes and additional details.
 * @class CustomError
 * @extends {Error}
 * @property {number} statusCode - HTTP status code associated with the error.
 * @property {any} [details] - Additional details about the error.
 * @constructor
 * @param {string} message - Error message.
 * @param {number} [statusCode=500] - HTTP status code (default is 500).
 * @param {any} [details] - Additional details about the error.
 */

export class CustomError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
