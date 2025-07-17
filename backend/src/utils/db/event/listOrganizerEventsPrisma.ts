import prisma from '../prisma';

export default async function listOrganizerEventsPrisma(
  organizerId: string,
  limit = 10,
  offset = 0
) {
  const events = await prisma.event.findMany({
    where: {
      organizerId: organizerId,
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return events;
}
