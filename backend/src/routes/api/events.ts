import { Router } from 'express';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  updateEvent,
  applyToEvent,
  listEventApplications,
} from '../../controllers/eventsController';

const router = Router();

router.post('/', authenticate, authorize(Role.ORGANIZER), createEvent);
router.get('/', listEvents);
router.get('/:id', getEventById);
router.patch('/:id', authenticate, authorize(Role.ORGANIZER), updateEvent);
router.delete('/:id', authenticate, authorize(Role.ORGANIZER), deleteEvent);

router.post(
  '/:id/applications',
  authenticate,
  authorize(Role.FREELANCER),
  applyToEvent
);

router.get(
  '/:id/applications',
  authenticate,
  authorize(Role.ORGANIZER),
  listEventApplications
);

export default router;
