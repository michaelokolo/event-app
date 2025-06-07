import { Role } from '../../generated/prisma';
/**
 * Checks if a given role is allowed for user signup.
 * Only 'FREELANCER' and 'ORGANIZER' are permitted.
 * @param {Role} role - The role to validate.
 * @returns boolean
 */

export function validateSignupRole(role: Role): string[] {
  const errors: string[] = [];

  if (role === undefined || role === null) {
    errors.push('Role must be provided');
    return errors;
  }

  const validRoles = Object.values(Role);

  if (!validRoles.includes(role)) {
    errors.push(`Role ${role} is not a valid role`);
    return errors;
  }

  if (role !== Role.FREELANCER && role !== Role.ORGANIZER) {
    errors.push('Role is not allowed for signup');
  }

  return errors;
}
