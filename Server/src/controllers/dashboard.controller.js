import User from '../models/User.js';
import DailyActivity from '../models/DailyActivity.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import { getUserDate } from '../utils/date.js';
import { calculateCurrentStreak } from '../utils/streak.js';

export const getDashboardSummary = async (req, res) => {
  const userId = req.userId;

  // 1️⃣ User + platforms
  const user = await User.findById(userId).select(
    'platforms settings.timezone'
  );

  const todayDate = getUserDate(user.settings.timezone);

  // 2️⃣ Today activity
  const today =
    (await DailyActivity.findOne({ userId, date: todayDate })) || {};

  // 3️⃣ Last 30 days activity (calendar)
  const calendar = await DailyActivity.find({ userId })
    .sort({ date: -1 })
    .limit(30)
    .select('date weightedScore');

  // 4️⃣ Weekly score
  const weekActivities = await DailyActivity.find({ userId })
    .sort({ date: -1 })
    .limit(7);

  const weeklyScore = weekActivities.reduce(
    (sum, d) => sum + d.weightedScore,
    0
  );

  // 5️⃣ Streaks
  const combinedStreak = await calculateCurrentStreak(userId);

  // Platform streaks (simple logic)
  const githubStreak = weekActivities.filter(
    d => d.github?.commits > 0
  ).length;

  const leetcodeStreak = weekActivities.filter(
    d => d.leetcode?.problemsSolved > 0
  ).length;

  const manualStreak = weekActivities.filter(
    d => d.manual?.score > 0
  ).length;

  // 6️⃣ Goals
  const goals = await Goal.find({ userId });

  // 7️⃣ Recent manual tasks (templates)
  const recentTasks = await Task.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(5);

  res.json({
    streaks: {
      combined: combinedStreak,
      github: githubStreak,
      leetcode: leetcodeStreak,
      manual: manualStreak
    },
    today: {
      date: todayDate,
      weightedScore: today.weightedScore || 0,
      github: today.github?.commits || 0,
      leetcode: today.leetcode?.problemsSolved || 0,
      manual: today.manual?.score || 0
    },
    weekly: {
      totalScore: weeklyScore,
      target: 100, // frontend can override later
      percentage: Math.min(
        Math.round((weeklyScore / 100) * 100),
        100
      )
    },
    calendar: calendar.map(d => ({
      date: d.date,
      score: d.weightedScore
    })),
    goals,
    recentTasks,
    platforms: user.platforms
  });
};
