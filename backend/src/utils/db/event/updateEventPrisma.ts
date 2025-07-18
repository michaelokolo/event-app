import prisma from '../prisma';

export interface UpdateEventParams {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  services?: string[];
  budget?: number;
}

export default async function updateEventPrisma(
  eventId: string,
  updateData: UpdateEventParams
) {
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: updateData,
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
  return updatedEvent;
}
