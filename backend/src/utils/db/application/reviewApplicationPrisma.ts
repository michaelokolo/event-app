import { ApplicationStatus } from '../../../../generated/prisma';
import prisma from '../prisma';

export default async function reviewApplicationPrisma(
  applicationId: string,
  organizerId: string,
  previousStatus: ApplicationStatus
) {
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.UNDER_REVIEW,
      lockedAt: new Date(),
      lockedById: organizerId,
      updatedAt: new Date(),
      history: {
        create: {
          previousStatus,
          newStatus: ApplicationStatus.UNDER_REVIEW,
          changedById: organizerId,
          reason: 'Started review',
        },
      },
    },
    include: {
      event: true,
      freelancer: true,
      history: true,
    },
  });
  return updatedApplication;
}
