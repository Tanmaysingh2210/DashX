import DailyActivity from '../models/DailyActivity.js';
import { SCORE_RULES } from '../config/scoring.js';

export const calculateCurrentStreak = async userId => {
  const activities = await DailyActivity.find({ userId })
    .sort({ date: -1 })
    .limit(90);

  let streak = 0;

  for (const day of activities) {
    if (day.weightedScore >= SCORE_RULES.MIN_DAILY_SCORE_FOR_STREAK) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
