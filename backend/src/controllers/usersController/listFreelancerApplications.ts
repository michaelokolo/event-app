import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';
import { ParsedQs } from 'qs';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import listFreelancerApplicationsPrisma from '../../utils/db/application/listFreelancerApplicationsPrisma';
import { applicationViewer } from '../../view/applicationViewer';

function parseApplicationListQuery(query: ParsedQs) {
  const { status, eventId, from, to, limit, offset } = query;

  return {
    status: status ? (status as string).split(',') : undefined,
    eventIds: eventId ? (eventId as string).split(',') : undefined,
    fromDate: from ? new Date(from as string) : undefined,
    toDate: to ? new Date(to as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
  };
}

export default async function listFreelancerApplications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const freelancerId = req.user?.id;
    if (!freelancerId) {
      logger.error('[User] Unauthenticated request to list applications');
      throw new UnauthorizedError('User not authenticated');
    }

    const { status, eventIds, fromDate, toDate, limit, offset } =
      parseApplicationListQuery(req.query);

    const filters: any = { freelancerId, deleted: false };

    if (status) filters.status = { in: status };
    if (eventIds) filters.eventId = { in: eventIds };
    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) filters.createdAt.gte = fromDate;
      if (toDate) filters.createdAt.lte = toDate;
    }

    const applications = await listFreelancerApplicationsPrisma(
      filters,
      limit,
      offset
    );

    const applicationViews = applications.map((app) => applicationViewer(app));
    logger.info(`[User] Listed ${applicationViews.length} applications`);
    res.status(200).json(applicationViews);
  } catch (error) {
    logger.error('[User] Error listing freelancer applications:', error);
    next(error);
  }
}
