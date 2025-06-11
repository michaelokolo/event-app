import { Router } from 'express';
import {
  login,
  logout,
  signup,
  refreshToken,
} from '../../controllers/authController';
import * as validator from '../../middleware/userValidator';

const router = Router();

router.post('/login', validator.userLoginValidator, login);
router.post('/signup', validator.userSignupValidator, signup);
router.post('/refresh', refreshToken);

export default router;
