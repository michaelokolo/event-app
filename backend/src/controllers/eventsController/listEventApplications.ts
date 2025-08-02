import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { ParsedQs } from 'qs';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import listEventApplicationsPrisma from '../../utils/db/application/listEventApplicationsPrisma';
import { applicationViewer } from '../../view/applicationViewer';
import prisma from '../../utils/db/prisma';

function parseApplicationListQuery(query: ParsedQs) {
  const { status, quoteMin, quoteMax, from, to, limit, offset } = query;

  return {
    status: status ? (status as string).split(',') : undefined,
    quoteMin: quoteMin ? parseFloat(quoteMin as string) : undefined,
    quoteMax: quoteMax ? parseFloat(quoteMax as string) : undefined,
    fromDate: from ? new Date(from as string) : undefined,
    toDate: to ? new Date(to as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
  };
}

export default async function listEventApplications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      logger.error(
        '[Event] Missing event ID in request to list Organizer applications'
      );
      throw new BadRequestError('Event ID is required');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.error(`[Event] Event with ID ${eventId} not found`);
      throw new BadRequestError('Event not found');
    }

    const organizerId = req.user?.id;

    if (!organizerId) {
      logger.error(
        '[Event] Unauthenticated request to list Organizer applications for event'
      );
      throw new UnauthorizedError('User not authenticated');
    }

    if (event.organizerId !== organizerId) {
      logger.error(
        `[Event] Organizer ID ${organizerId} does not match event organizer ID ${event.organizerId}`
      );
      throw new UnauthorizedError(
        'You are not authorized to view applications for this event'
      );
    }

    const { status, quoteMin, quoteMax, fromDate, toDate, limit, offset } =
      parseApplicationListQuery(req.query);

    const filters: any = { eventId, deleted: false };
    if (status) filters.status = { in: status };
    if (quoteMin) filters.rateQuote = { gte: quoteMin };
    if (quoteMax) filters.rateQuote = { ...filters.rateQuote, lte: quoteMax };
    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) filters.createdAt.gte = fromDate;
      if (toDate) filters.createdAt.lte = toDate;
    }

    const applications = await listEventApplicationsPrisma(
      filters,
      limit,
      offset
    );

    const applicationViews = applications.map((app) => applicationViewer(app));
    logger.info(
      `[Event] Listed ${applicationViews.length} applications for event ${eventId} by organizer ${organizerId}`
    );
    res.status(200).json(applicationViews);
  } catch (error) {
    logger.error('[Event] Error listing applications for event:', error);
    next(error);
  }
}
