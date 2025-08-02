import prisma from '../prisma';
import { ApplicationStatus } from '../../../../generated/prisma';

export default async function deleteApplicationPrisma(
  applicationId: string,
  applicationStatus: ApplicationStatus,
  freelancerId: string
) {
  const deletedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      deleted: true,
      updatedAt: new Date(),
      history: {
        create: {
          previousStatus: applicationStatus,
          newStatus: applicationStatus,
          changedById: freelancerId,
          reason: 'Soft deleted by freelancer',
        },
      },
    },
    include: {
      event: true,
      freelancer: true,
      history: true,
    },
  });
  return deletedApplication;
}
