import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import prisma from '../../utils/db/prisma';
import updateEventPrisma from '../../utils/db/event/updateEventPrisma';
import eventViewer from '../../view/eventViewer';

export default async function updateEvent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const eventId = req.params.id;

  const organizerId = req.user?.id;
  const eventData = req.body;

  if (!organizerId) {
    logger.warn('[Event] Unauthorized update event attempt', { eventId });
    throw new UnauthorizedError('User not authenticated');
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.warn('[Event] Event not found', { eventId });
      throw new NotFoundError('Event not found');
    }
    if (event.organizerId !== organizerId) {
      logger.warn('[Event] Unauthorized update event attempt', {
        eventId,
        organizerId,
      });
      throw new UnauthorizedError('User not authorized to update this event');
    }
    const updatedEvent = await updateEventPrisma(eventId, eventData);
    logger.info('[Event] Event updated successfully', {
      eventId,
      organizerId,
      updatedFields: Object.keys(eventData),
    });

    const updatedEventView = eventViewer(updatedEvent);
    res.status(200).json(updatedEventView);
  } catch (error) {
    logger.error('[Event] Failed to update event', {
      error,
      eventId,
      organizerId,
    });
    next(error);
  }
}
