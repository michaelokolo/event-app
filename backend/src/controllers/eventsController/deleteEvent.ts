import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import logger from '../../utils/logger';
import deleteEventPrisma from '../../utils/db/event/deleteEventPrisma';
import prisma from '../../utils/db/prisma';

export default async function deleteEvent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const eventId = req.params.id;

  const organizerId = req.user?.id;

  if (!organizerId) {
    logger.warn('Unauthorized delete event attempt', { eventId });
    throw new UnauthorizedError('User not authenticated');
  }

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
    const deletedEvent = await deleteEventPrisma(eventId);
    if (!deletedEvent) {
      logger.warn(
        `[Event] Event with ID: ${eventId} not found or unauthorized`
      );
      throw new UnauthorizedError(
        'Event not found or user not authorized to delete it'
      );
    }
    logger.info(`[Event] Event with ID: ${eventId} deleted successfully`, {
      eventId,
    });

    res.status(204).json();
  } catch (error) {
    logger.error('Error deleting event', {
      error,
      eventId,
      organizerId,
    });
    next(
      error instanceof UnauthorizedError
        ? error
        : new InternalServerError('Failed to delete event', error)
    );
  }
}
