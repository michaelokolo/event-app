import { Response, Request, NextFunction } from 'express';
import logger from '../../utils/logger';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import prisma from '../../utils/db/prisma';
import { ApplicationStatus } from '../../../generated/prisma';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import reviewApplicationPrisma from '../../utils/db/application/reviewApplicationPrisma';
import { applicationViewer } from '../../view/applicationViewer';

export default async function reviewApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const applicationId = req.params.id;
    const organizerId = req.user?.id;

    if (!applicationId) {
      logger.error('[Application] Application ID is required for review');
      throw new BadRequestError('Application ID is required');
    }

    if (!organizerId) {
      logger.error(
        '[Application] User not authenticated for application review'
      );
      throw new UnauthorizedError('User not authenticated');
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        event: true,
      },
    });

    if (!application) {
      logger.error(
        `[Application] Application with ID ${applicationId} not found`
      );
      throw new NotFoundError(`Application not found`);
    }

    if (application?.event.organizerId !== organizerId) {
      logger.error(
        `[Application] Organizer ID ${organizerId} does not match event organizer`
      );
      throw new UnauthorizedError(
        'You are not authorized to review this application'
      );
    }

    if (application.status !== ApplicationStatus.SUBMITTED) {
      logger.error(
        `[Application] Application with ID ${applicationId} is not in SUBMITTED status`
      );
      throw new ForbiddenError(
        'Only applications in SUBMITTED status can be reviewed'
      );
    }

    if (application.lockedAt) {
      logger.error(
        `[Application] Application with ID ${applicationId} is locked`
      );
      throw new ForbiddenError('Application is already locked for review');
    }

    const reviewedApplication = await reviewApplicationPrisma(
      applicationId,
      organizerId,
      application.status
    );
    const applicationView = applicationViewer(reviewedApplication);
    logger.info(
      `[Application] Application with ID ${applicationId} is now under review`
    );
    res.status(200).json(applicationView);
  } catch (error) {
    logger.error('[Applications] Error reviewing application:', error);
    next(error);
  }
}
