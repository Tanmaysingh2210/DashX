import DailyActivity from '../models/DailyActivity.js';
import Goal from '../models/Goal.js';
import { calculateCurrentStreak } from './streak.js';

export const updateGoalsForUser = async userId => {
  const goals = await Goal.find({ userId });

  for (const goal of goals) {
    let value = 0;

    if (goal.metric === 'WEIGHTED_SCORE') {
      const activities = await DailyActivity.find({ userId });
      value = activities.reduce((sum, d) => sum + d.weightedScore, 0);
    }

    if (goal.metric === 'GITHUB_COMMITS') {
      const activities = await DailyActivity.find({ userId });
      value = activities.reduce(
        (sum, d) => sum + (d.github?.commits || 0),
        0
      );
    }

    if (goal.metric === 'LEETCODE_PROBLEMS') {
      const activities = await DailyActivity.find({ userId });
      value = activities.reduce(
        (sum, d) => sum + (d.leetcode?.problemsSolved || 0),
        0
      );
    }

    if (goal.metric === 'STREAK') {
      value = await calculateCurrentStreak(userId);
    }

    await Goal.findByIdAndUpdate(goal._id, {
      currentValue: value
    });
  }
};
