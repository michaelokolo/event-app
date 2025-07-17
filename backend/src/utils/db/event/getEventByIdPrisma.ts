import prisma from '../prisma';

export default async function getEventByIdPrisma(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
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
  });
  return event;
}
