import prisma from '../prisma';

export default async function listEventsPrisma(limit = 10, offset = 0) {
  const events = await prisma.event.findMany({
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
