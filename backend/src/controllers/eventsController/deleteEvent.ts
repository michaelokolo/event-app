import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import logger from '../../utils/logger';
import deleteEventPrisma from '../../utils/db/event/deleteEventPrisma';

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
    const deletedEvent = await deleteEventPrisma(eventId, organizerId);
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
