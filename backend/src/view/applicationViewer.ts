import { time } from 'console';
import {
  Application,
  User,
  Event,
  ApplicationHistory,
} from '../../generated/prisma';

interface ApplicationWithRelations extends Application {
  event: Event;
  freelancer: User;
  history: ApplicationHistory[];
}

export function applicationViewer(application: ApplicationWithRelations) {
  const applicationView = {
    id: application.id,
    message: application.message,
    rateQuote: application.rateQuote,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    deleted: application.deleted,
    event: {
      id: application.event.id,
      title: application.event.title,
      date: application.event.date.toISOString(),
      location: application.event.location,
      budget: application.event.budget,
    },
    freelancer: {
      id: application.freelancer.id,
      firstName: application.freelancer.firstName,
      lastName: application.freelancer.lastName,
    },
    history: application.history.map((h) => ({
      newStatus: h.newStatus,
      previousStatus: h.previousStatus,
      changedById: h.changedById,
      comment: h.comment,
      timestamp: h.timestamp.toISOString(),
      reason: h.reason,
    })),
  };

  return applicationView;
}
