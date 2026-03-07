import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { createGoal, getGoals } from '../controllers/goal.controller.js';

const router = Router();

router.post('/', auth, createGoal);
router.get('/', auth, getGoals);

export default router;
