import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60
});

router.post('/register',authLimiter, register);
router.post('/login',authLimiter, login);
router.post('/refresh', refreshLimiter, refresh);
router.post('/logout', logout);

export default router;
