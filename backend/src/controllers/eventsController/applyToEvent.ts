import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import prisma from '../../utils/db/prisma';
import applyToEventPrisma from '../../utils/db/application/applyToEventPrisma';
import { applicationViewer } from '../../view/applicationViewer';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { ConflictError } from '../../utils/errors/ConflictError';
import { NotFoundError } from '../../utils/errors/NotFoundError';

export default async function applyToEvent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const eventId = req.params.id;
  const freelancerId = req.user?.id;
  const { message, rateQuote } = req.body;

  if (!eventId) {
    logger.error('[Event] Event ID is required for application');
    throw new BadRequestError('Event ID is required for application');
  }

  if (!freelancerId) {
    logger.error('[Event] Unauthenticated application attempt', { eventId });
    throw new UnauthorizedError('User not authenticated');
  }

  if (!message || !rateQuote) {
    logger.error('[Event] Message and rate quote are required for application');
    throw new BadRequestError(
      'Message and rate quote are required for application'
    );
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.error('[Event] Event not found', { eventId });
      throw new NotFoundError('Event not found');
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        eventId: event.id,
        freelancerId: freelancerId,
      },
    });

    if (existingApplication) {
      logger.warn('[Event] Duplicate application attempt', {
        eventId,
        freelancerId,
      });
      throw new ConflictError('You have already applied to this event');
    }

    const applicationData = {
      eventId,
      freelancerId,
      message,
      rateQuote,
    };

    const application = await applyToEventPrisma(applicationData);
    if (!application) {
      logger.error('[Event] Application creation failed', { applicationData });
      throw new InternalServerError(
        'Something went wrong while applying to the event'
      );
    }
    logger.info('[Event] Application created successfully', {
      applicationId: application.id,
      eventId: application.eventId,
      freelancerId: application.freelancerId,
    });

    const applicationView = applicationViewer(application);

    res.status(201).json(applicationView);
  } catch (error) {
    logger.error('[Event] Error applying to event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId,
      freelancerId,
    });
    next(error);
  }
}
