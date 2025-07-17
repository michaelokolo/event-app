import { Response, Request, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import createEventPrisma from '../../utils/db/event/createEventPrisma';
import logger from '../../utils/logger';
import eventViewer from '../../view/eventViewer';

export default async function createEvent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const eventData = req.body;
  const organizerId = req.user?.id;

  if (!organizerId) {
    logger.warn(`[Event] Unauthorized attempt to create event - IP: ${req.ip}`);
    throw new UnauthorizedError(
      'User not authenticated or organizer ID missing'
    );
  }

  try {
    const event = await createEventPrisma(eventData, organizerId);
    if (!event) {
      logger.warn(
        `[Event] Failed to create event - Organizer ID: ${organizerId}`
      );
      throw new InternalServerError('Failed to create event');
    }

    logger.info(
      `[Event] Event created successfully - ID: ${event.id}, Organizer: ${organizerId}`
    );

    const eventView = eventViewer(event);

    res.status(201).json(eventView);
  } catch (error) {
    logger.error(
      `[Event] Error creating event - Organizer ID: ${organizerId}, Error: ${error}`
    );
    next(error);
  }
}
