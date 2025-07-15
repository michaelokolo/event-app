import prisma from '../prisma';
import { InternalServerError } from '../../errors/InternalServerError';
import logger from '../../logger';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export default async function deleteEventPrisma(
  eventId: string,
  organizerId: string
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.organizerId !== organizerId) {
      logger.warn('Unauthorized delete event attempt', {
        eventId,
        organizerId,
      });
      throw new UnauthorizedError('User not authorized to delete this event');
    }
    const deletedEvent = await prisma.event.delete({
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
    return deletedEvent;
  } catch (error) {
    logger.error('Failed to delete event from database', {
      error,
      eventId,
      organizerId,
    });
    throw error instanceof UnauthorizedError
      ? error
      : new InternalServerError('Failed to delete event', error);
  }
}
