import Goal from '../models/Goal.js';
import DailyActivity from '../models/DailyActivity.js';
import { calculateCurrentStreak } from '../utils/streak.js';
import { updateGoalsForUser } from '../utils/goalUpdater.js';

export const createGoal = async (req, res) => {
  try {
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

    await updateGoalsForUser(req.userId);

    const updatedGoal = await Goal.findById(goal._id);

    res.status(201).json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create goal', error: err.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch goals', error: err.message });
  }
};
