import { ApplicationStatus } from '../../../../generated/prisma';
import prisma from '../../../utils/db/prisma';
interface applicationparams {
  eventId: string;
  freelancerId: string;
  message: string;
  rateQuote: number;
}

export default async function applyToEventPrisma(
  applicationData: applicationparams
) {
  const application = await prisma.application.create({
    data: {
      eventId: applicationData.eventId,
      freelancerId: applicationData.freelancerId,
      message: applicationData.message,
      rateQuote: applicationData.rateQuote,
      status: ApplicationStatus.SUBMITTED,
      history: {
        create: {
          previousStatus: null,
          newStatus: ApplicationStatus.SUBMITTED,
          changedById: applicationData.freelancerId,
          comment: 'Application submitted.',
        },
      },
    },
    include: {
      event: true,
      freelancer: true,
      history: true,
    },
  });
  return application;
}
