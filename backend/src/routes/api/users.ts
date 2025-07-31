import { Router } from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getUserById,
} from '../../controllers/usersController';
import { listOrganizerEvents } from '../../controllers/usersController';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';
import { listFreelancerApplications } from '../../controllers/usersController';

const router = Router();

router.get('/me', authenticate, getCurrentUser);
router.patch('/me', authenticate, updateCurrentUser);
router.delete('/me', authenticate, deleteCurrentUser);

router.get('/:id', authenticate, authorize(Role.ADMIN), getUserById);

router.get(
  '/me/events',
  authenticate,
  authorize(Role.ORGANIZER),
  listOrganizerEvents
);

router.get(
  '/me/applications',
  authenticate,
  authorize(Role.FREELANCER),
  listFreelancerApplications
);

export default router;
