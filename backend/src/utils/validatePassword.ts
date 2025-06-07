/**
 * Validates a password based on specific criteria.
 * The password must be between 8 and 64 characters long, contain at least one uppercase letter,
 * one lowercase letter, one number, one special character, and must not contain spaces.
 * If the password is invalid, an array of error messages is returned.
 * @param {string} password - The password to validate.
 * @return string[] - An array of error messages if the password is invalid, or an empty array if valid.
 */

export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (!password) {
    errors.push('password must be provided');
    return errors;
  }
  if (password.length < 8) {
    errors.push('password must be at least 8 characters long');
  }
  if (password.length > 64) {
    errors.push('password must be at most 64 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('password must contain at least one special character');
  }
  if (password.includes(' ')) {
    errors.push('password must not contain spaces');
  }
  return errors;
}
