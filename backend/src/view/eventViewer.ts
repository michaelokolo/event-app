export interface EventView {
  id: string;
  title: string;
  date: Date;
  description: string;
  location: string;
  services: string[];
  budget: number;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string | null;
  };
}

export default function eventViewer(EventView: EventView) {
  const eventView = {
    id: EventView.id,
    title: EventView.title,
    date: EventView.date.toISOString(),
    description: EventView.description,
    location: EventView.location,
    services: EventView.services,
    budget: EventView.budget,
    organizer: {
      id: EventView.organizer.id,
      firstName: EventView.organizer.firstName,
      lastName: EventView.organizer.lastName,
      email: EventView.organizer.email,
      company: EventView.organizer.company || null,
    },
  };

  return eventView;
}
