import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import logger from '../../utils/logger';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import prisma from '../../utils/db/prisma';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { ApplicationStatus } from '../../../generated/prisma';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import withdrawApplicationPrisma from '../../utils/db/application/withdrawApplicationPrisma';
import { applicationViewer } from '../../view/applicationViewer';

export default async function withdrawApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const applicationId = req.params.id;
    const freelancerId = req.user?.id;
    const { reason } = req.body;

    if (!applicationId) {
      logger.error('[Applications] Application ID is required for withdrawal');
      throw new BadRequestError('Application ID is required');
    }

    if (!freelancerId) {
      logger.error(
        '[Applications] User not authenticated for application withdrawal'
      );
      throw new UnauthorizedError('User not authenticated');
    }

    if (!reason) {
      logger.error('[Applications] Withdrawal reason is required');
      throw new BadRequestError('Withdrawal reason is required');
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
        'You are not authorized to withdraw this application'
      );
    }

    if (application.status !== ApplicationStatus.SUBMITTED) {
      logger.error(
        `[Applications] Application with ID ${applicationId} cannot be withdrawn because it is not in SUBMITTED status`
      );
      throw new ForbiddenError(
        'Application can only be withdrawn when it is in SUBMITTED status'
      );
    }

    if (application.lockedAt) {
      logger.error(
        `[Applications] Application with ID ${applicationId} is under review and cannot be withdrawn`
      );
      throw new ForbiddenError(
        'Application is under review and cannot be withdrawn'
      );
    }

    const withdrawnApplication = await withdrawApplicationPrisma(
      applicationId,
      application.status,
      freelancerId,
      reason
    );
    const applicationView = applicationViewer(withdrawnApplication);
    logger.info(
      `[Applications] Application with ID ${applicationId} successfully withdrawn`
    );
    res.status(200).json(applicationView);
  } catch (error) {
    logger.error('[Applications] Error withdrawing application:', error);
    next(error);
  }
}
