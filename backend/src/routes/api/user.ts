import { Router } from 'express';
import { getCurrentUser } from '../../controllers/userController/getCurrentUser';
import { authenticate } from '../../middleware/auth/authenticate';

const router = Router();

router.get('/me', authenticate, getCurrentUser);

export default router;
