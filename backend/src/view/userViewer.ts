import { User } from '../../generated/prisma';

export default function userViewer(user: User, token?: string) {
  const userView = {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: token,
      company: user.company || null,
      skills: user.skills || [],
      bio: user.bio || null,
      portfolio: user.portfolio || null,
    },
  };
  return userView;
}
