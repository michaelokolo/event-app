import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import prisma from '../../utils/db/prisma';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import deleteApplicationPrisma from '../../utils/db/application/deleteApplicationPrisma';
import { applicationViewer } from '../../view/applicationViewer';

export default async function deleteApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const applicationId = req.params.id;

    const freelancerId = req.user?.id;

    if (!applicationId) {
      logger.error('[Applications] Application ID is required for deletion');
      throw new BadRequestError('Application ID is required');
    }

    if (!freelancerId) {
      logger.error(
        '[Applications] User not authenticated for application deletion'
      );
      throw new UnauthorizedError('User not authenticated');
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      logger.error(
        `[Applications] Application with ID ${applicationId} not found`
      );
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    if (application.freelancerId !== freelancerId) {
      logger.error(
        `[Applications] Freelancer ID ${freelancerId} does not match application owner`
      );
      throw new UnauthorizedError(
        `You are not authorized to delete this application`
      );
    }

    if (application.lockedAt) {
      logger.error(
        `[Applications] Application with ID ${applicationId} is locked and cannot be deleted`
      );
      throw new ForbiddenError(
        'This application is under review and locked and cannot be deleted'
      );
    }

    const deletedApplication = await deleteApplicationPrisma(
      applicationId,
      application.status,
      freelancerId
    );
    logger.info(
      `[Applications] Application with ID ${applicationId} successfully deleted`
    );
    const applicationView = applicationViewer(deletedApplication);
    res.status(200).json(applicationView);
  } catch (error) {
    logger.error('[Applications] Error deleting application:', error);
    next(error);
  }
}
