import { Router } from 'express';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorize } from '../../middleware/auth/authorize';
import { Role } from '../../../generated/prisma';
import { listUsers } from '../../controllers/adminController/listUsers';

const router = Router();

router.get('/users', authenticate, authorize(Role.ADMIN), listUsers);

export default router;
