import { Router } from 'express';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  listOrganizerEvents,
  updateEvent,
} from '../../controllers/eventsController';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  createEvent
);
router.get('/', listEvents);
router.get('/:id', getEventById);
router.patch(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  updateEvent
);
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  deleteEvent
);
router.get(
  '/me/events',
  authenticate,
  authorize(Role.ORGANIZER),
  listOrganizerEvents
);

export default router;
