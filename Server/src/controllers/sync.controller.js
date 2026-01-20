import User from '../models/User.js';
import DailyActivity from '../models/DailyActivity.js';
import { fetchGitHubActivity } from '../services/github.service.js';
import { fetchLeetCodeActivity } from '../services/leetcode.service.js';
import { getUserYesterdayDate } from '../utils/date.js';
import { SCORE_RULES } from '../config/scoring.js';
import { updateGoalsForUser } from '../utils/goalUpdater.js';
import { retryOnce } from '../utils/retry.js';
import { logError } from '../utils/logger.js';

export const dailySync = async (req, res) => {
    let processed = 0;

    try {
        const users = await User.find({
            $or: [
                { 'platforms.github.connected': true },
                { 'platforms.leetcode.connected': true }
            ]
        }).select('platforms settings.timezone');

        for (const user of users) {
            const date = getUserYesterdayDate(user.settings.timezone);

            const exists = await DailyActivity.findOne({
                userId: user._id,
                date
            });

            if (exists) continue;

            let githubCommits = 0;
            let leetcodeSolved = 0;

            // GitHub (isolated)
            if (user.platforms.github?.connected) {
                try {
                    const data = await retryOnce(() =>
                        fetchGitHubActivity(user.platforms.github.username)
                    );
                    githubCommits = data.commits;
                } catch (err) {
                    logError('GitHub sync failed', {
                        userId: user._id.toString(),
                        error: err.message
                    });
                }
            }

            // LeetCode (isolated)
            if (user.platforms.leetcode?.connected) {
                try {
                    const data = await retryOnce(() =>
                        fetchLeetCodeActivity(user.platforms.leetcode.username)
                    );
                    leetcodeSolved = data.problemsSolved;
                } catch (err) {
                    logError('LeetCode sync failed', {
                        userId: user._id.toString(),
                        error: err.message
                    });
                }
            }

            const weightedScore =
                githubCommits * SCORE_RULES.GITHUB_COMMIT_WEIGHT +
                leetcodeSolved * SCORE_RULES.LEETCODE_PROBLEM_WEIGHT;

            await DailyActivity.create({
                userId: user._id,
                date,
                github: { commits: githubCommits },
                leetcode: { problemsSolved: leetcodeSolved },
                weightedScore
            });

            const update = {};
            if (user.platforms.github?.connected) {
                update['platforms.github.lastSyncedAt'] = new Date();
            }
            if (user.platforms.leetcode?.connected) {
                update['platforms.leetcode.lastSyncedAt'] = new Date();
            }

            if (Object.keys(update).length) {
                await User.findByIdAndUpdate(user._id, { $set: update });
            }

            await updateGoalsForUser(user._id);
            processed++;
        }

        res.json({ status: 'success', processedUsers: processed });

    } catch (err) {
        logError('Daily sync crashed', { error: err.message });
        res.status(500).json({ status: 'failed' });
    }
};
