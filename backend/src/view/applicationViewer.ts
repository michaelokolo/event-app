import { Application, User, Event } from '../../generated/prisma';

interface ApplicationWithRelations extends Application {
  event: Event;
  freelancer: User;
}

export function applicationViewer(application: ApplicationWithRelations) {
  const applicationView = {
    id: application.id,
    message: application.message,
    rateQuote: application.rateQuote,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    event: {
      id: application.event.id,
      title: application.event.title,
      date: application.event.date.toISOString(),
      location: application.event.location,
      services: application.event.services,
      budget: application.event.budget,
    },
    freelancer: {
      id: application.freelancer.id,
      firstName: application.freelancer.firstName,
      lastName: application.freelancer.lastName,
      email: application.freelancer.email,
      company: application.freelancer.company,
      skills: application.freelancer.skills,
      bio: application.freelancer.bio,
      portfolio: application.freelancer.portfolio,
    },
  };

  return applicationView;
}
