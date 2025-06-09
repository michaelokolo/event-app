import { Router } from 'express';
import { login, logout, signup } from '../../controllers/authController';
import * as validator from '../../middleware/userValidator';

const router = Router();

router.post('/login', validator.userLoginValidator, login);
router.post('/signup', validator.userSignupValidator, signup);

export default router;
