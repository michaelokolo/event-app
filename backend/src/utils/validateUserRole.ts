import { Role } from '../../generated/prisma';
/**
 * Checks if a given role is allowed for user signup.
 * Only 'FREELANCER' and 'ORGANIZER' are permitted.
 * @param {Role} role - The role to validate.
 * @returns boolean
 */

export function isAllowedSignupRole(role: Role): boolean {
  return role === Role.FREELANCER || role === Role.ORGANIZER;
}
