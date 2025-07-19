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
      status: ApplicationStatus.PENDING,
    },
    include: {
      event: true,
      freelancer: true,
    },
  });
  return application;
}
