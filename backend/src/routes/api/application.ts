import {
  deleteApplication,
  getApplicationById,
  listEventApplications,
  listFreelancerApplications,
  updateApplicationStatus,
} from '../../controllers/applicationController';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';

import { Router } from 'express';

const router = Router();

export default router;
