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
} from '../../controllers/eventsController';

const router = Router();

router.post('/', authenticate, authorize(Role.ORGANIZER), createEvent);
router.get('/', listEvents);
router.get('/:id', getEventById);
router.patch('/:id', authenticate, authorize(Role.ORGANIZER), updateEvent);
router.delete('/:id', authenticate, authorize(Role.ORGANIZER), deleteEvent);

export default router;
