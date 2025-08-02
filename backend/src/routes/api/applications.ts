import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';
import {
  withdrawApplication,
  deleteApplication,
  reviewApplication,
} from '../../controllers/applicationController';

import { Router } from 'express';

const router = Router();

router.patch(
  '/:id/withdraw',
  authenticate,
  authorize(Role.FREELANCER),
  withdrawApplication
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.FREELANCER),
  deleteApplication
);

router.patch(
  '/:id/review',
  authenticate,
  authorize(Role.ORGANIZER),
  reviewApplication
);

export default router;
