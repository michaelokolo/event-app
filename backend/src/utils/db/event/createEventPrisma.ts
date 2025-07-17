import { InternalServerError } from '../../errors/InternalServerError';
import logger from '../../logger';
import prisma from '../prisma';

interface CreateEventParams {
  title: string;
  date: Date;
  description: string;
  location: string;
  services: string[];
  budget: number;
}

export default async function createEventPrisma(
  params: CreateEventParams,
  organizerId: string
) {
  const { title, date, description, location, services, budget } = params;

  const event = await prisma.event.create({
    data: {
      title,
      date,
      description,
      location,
      services,
      budget,
      organizer: {
        connect: { id: organizerId },
      },
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
  });

  return event;
}
