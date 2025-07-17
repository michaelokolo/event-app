import { Response, Request, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import logger from '../../utils/logger';
import eventViewer from '../../view/eventViewer';
import listEventsPrisma from '../../utils/db/event/listEventsPrisma';

function parseEventListQuery(query: ParsedQs) {
  const { limit, offset } = query;

  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;

  return { limit: limitNumber, offset: offsetNumber };
}

export default async function listEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { limit, offset } = parseEventListQuery(req.query);
  try {
    const events = await listEventsPrisma(limit, offset);
    const eventViews = events.map((event) => eventViewer(event));
    logger.info(`[Event] Listed ${eventViews.length} events`);
    res.status(200).json(eventViews);
  } catch (error) {
    logger.error('Error listing events:', error);
    next(error);
  }
}
