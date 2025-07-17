import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { ParsedQs } from 'qs';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import listOrganizerEventsPrisma from '../../utils/db/event/listOrganizerEventsPrisma';
import eventViewer from '../../view/eventViewer';

function parseEventListQuery(query: ParsedQs) {
  const { limit, offset } = query;

  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;

  return { limit: limitNumber, offset: offsetNumber };
}

export default async function listOrganizerEvents(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { limit, offset } = parseEventListQuery(req.query);
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      logger.warn(
        `[User] Unauthorized attempt to list organizer events - IP: ${req.ip}`
      );
      throw new UnauthorizedError(
        'User not authenticated or organizer ID missing'
      );
    }
    const events = await listOrganizerEventsPrisma(organizerId, limit, offset);
    if (!events || events.length === 0) {
      logger.info(`[User] No events found for organizer - ID: ${organizerId}`);
      throw new NotFoundError('No events found for this organizer');
    }
    logger.info(
      `[User] Events listed successfully for organizer - ID: ${organizerId}`
    );
    const eventViews = events.map((event) => eventViewer(event));
    logger.debug(
      `[User] Organizer events view created - Organizer ID: ${organizerId}, Events Count: ${eventViews.length}`
    );
    res.status(200).json(eventViews);
  } catch (error) {
    logger.error(
      `[User] Error listing organizer events - Organizer ID: ${req.user?.id}, Error: ${error}`
    );
    next(error);
  }
}
