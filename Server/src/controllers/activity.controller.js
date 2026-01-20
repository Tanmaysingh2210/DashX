import DailyActivity from '../models/DailyActivity.js';
import User from '../models/User.js';
import { SCORE_RULES } from '../config/scoring.js';
import { getUserDate } from '../utils/date.js';
import { updateGoalsForUser } from '../utils/goalUpdater.js';

export const getTodayActivity = async (req, res) => {
    const user = await User.findById(req.userId);
    const date = getUserDate(user.settings.timezone);

    const activity = await DailyActivity.findOne({
        userId: req.userId,
        date
    });

    res.json(activity || { date, weightedScore: 0 });
};

export const updateActivity = async (req, res) => {
    const user = await User.findById(req.userId);
    const date = getUserDate(user.settings.timezone);

    const { github = 0, leetcode = 0, manualScore = 0 } = req.body;

    const weightedScore =
        github * SCORE_RULES.GITHUB_COMMIT_WEIGHT +
        leetcode * SCORE_RULES.LEETCODE_PROBLEM_WEIGHT +
        manualScore;

    const activity = await DailyActivity.findOneAndUpdate(
        { userId: req.userId, date },
        {
            $set: {
                'github.commits': github,
                'leetcode.problemsSolved': leetcode,
                'manual.score': manualScore,
                weightedScore
            }
        },
        { upsert: true, new: true }
    );

    await updateGoalsForUser(req.userId);

    res.json(activity);
};
