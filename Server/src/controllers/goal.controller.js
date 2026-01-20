import Goal from '../models/Goal.js';
import DailyActivity from '../models/DailyActivity.js';
import { calculateCurrentStreak } from '../utils/streak.js';

export const createGoal = async (req, res) => {
  const {
    title,
    description,
    metric,
    period,
    targetValue,
    deadline
  } = req.body;

  const goal = await Goal.create({
    userId: req.userId,
    title,
    description,
    metric,
    period,
    targetValue,
    deadline
  });

  res.status(201).json(goal);
};
