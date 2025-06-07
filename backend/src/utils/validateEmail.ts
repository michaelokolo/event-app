/**
 * Validates an email address.
 * The email must be a string, contain an '@' symbol, and must not contain spaces.
 * If the email is invalid, an array of error messages is returned.
 * @param {string} email - The email address to validate.
 * @return string[] - An array of error messages if the email is invalid, or an empty array if valid.
 *
 */

export function validateEmail(email: string): string[] {
  const errors: string[] = [];

  if (!email) {
    errors.push('email must be provided');
    return errors;
  }
  if (typeof email !== 'string') {
    errors.push('email must be a string');
  }
  if (!email.includes('@')) {
    errors.push('email must be a valid email address');
  }
  if (email.includes(' ')) {
    errors.push('email must not contain spaces');
  }
  return errors;
}
