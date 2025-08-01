import { ApplicationStatus } from '../../../../generated/prisma';
import prisma from '../prisma';

export default async function withdrawApplicationPrisma(
  applicationId: string,
  previousStatus: ApplicationStatus,
  freelancerId: string,
  reason?: string
) {
  const withdrawnApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.WITHDRAWN,
      withdrawnMessage: reason,
      updatedAt: new Date(),
      history: {
        create: {
          previousStatus,
          newStatus: ApplicationStatus.WITHDRAWN,
          changedById: freelancerId,
          reason: reason || 'Withdrawn (no reason provided)',
        },
      },
    },
    include: {
      event: true,
      freelancer: true,
      history: true,
    },
  });

  return withdrawnApplication;
}
