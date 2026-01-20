import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { createGoal } from '../controllers/goal.controller.js';

const router = Router();

router.post('/', auth, createGoal);
router.get('/', auth, async (req, res) => {
  const goals = await Goal.find({ userId: req.userId });
  res.json(goals);
});

export default router;
