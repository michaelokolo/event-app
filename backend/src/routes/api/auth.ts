import { Router } from 'express';
import { login, logout, signup } from '../../controllers/authController';

const router = Router();

router.post('/signup', signup);

export default router;
