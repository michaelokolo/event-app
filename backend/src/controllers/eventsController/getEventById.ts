import { Response, Request, NextFunction } from 'express';
import getEventByIdPrisma from '../../utils/db/event/getEventByIdPrisma';
import logger from '../../utils/logger';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import eventViewer from '../../view/eventViewer';

export default async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      logger.warn('[Event] Missing event ID in request');
      res.status(400).json({ error: 'Event ID is required' });
    }

    const event = await getEventByIdPrisma(eventId);
    if (!event) {
      logger.warn(`[Event] Event not found for ID: ${eventId}`);
      throw new NotFoundError('Event not found');
    }
    logger.info(`[Event] Event retrieved successfully - ID: ${event.id}`);
    const eventView = eventViewer(event);
    res.status(200).json(eventView);
  } catch (error) {
    logger.error(
      `[Event] Error retrieving event - ID: ${req.params.id}, Error: ${error}`
    );
    next(error);
  }
}
