import { User } from '../../generated/prisma';

export default function userViewer(user: User, token?: string) {
  const userView = {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: token,
    },
  };
  return userView;
}
