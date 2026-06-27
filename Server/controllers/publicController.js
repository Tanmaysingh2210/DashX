import User from "../models/User.js";
import Activity from "../models/Activity.js";
import { calculateStreaks } from "../services/activityService.js";

// ─── GET /public/:username ────────────────────────────────────────────────────

/**
 * Returns a user's public profile + activity data.
 * No authentication required — this is the shareable link endpoint.
 *
 * Returns 404 if:
 *   - User doesn't exist
 *   - User has isPublic: false
 *
 * Returns only the data needed for the public profile view —
 * no email, no internal sync details.
 */
export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // case-insensitive lookup — handle Tanmaysingh2210 vs tanmaysingh2210
        const user = await User.findOne({
            githubUsername: { $regex: new RegExp(`^${username}$`, "i") },
        }).select(
            "githubUsername leetcodeUsername avatar isPublic longestStreak createdAt"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        if (user.isPublic === false) {
            return res.status(404).json({
                success: false,
                message: "This profile is private",
            });
        }

        if (!user.leetcodeUsername) {
            return res.status(404).json({
                success: false,
                message: "Profile setup not complete",
            });
        }

        // fetch last 365 days of active activity
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        const today = new Date().toISOString().split("T")[0];

        const days = await Activity.find({
            userId: user._id,
            date: { $gte: oneYearAgo, $lte: today },
            totalCount: { $gt: 0 }, // only active days
        })
            .sort({ date: 1 })
            .select("-_id date githubCount leetcodeCount totalCount")
            .lean();

        // calculate streaks from active days
        const { currentStreak, longestStreak } = calculateStreaks(days);

        // ── summary stats ──
        const githubTotal = days.reduce((s, d) => s + d.githubCount, 0);
        const leetcodeTotal = days.reduce((s, d) => s + d.leetcodeCount, 0);

        // consistency — active calendar days in last 30
        const activeDateSet = new Set(days.map((d) => d.date));
        let activeIn30 = 0;
        const todayDate = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(Date.UTC(
                todayDate.getUTCFullYear(),
                todayDate.getUTCMonth(),
                todayDate.getUTCDate() - i
            )).toISOString().split("T")[0];
            if (activeDateSet.has(d)) activeIn30++;
        }
        const consistency = Math.round((activeIn30 / 30) * 100);

        // last 7 days
        const sevenDaysAgo = new Date(Date.UTC(
            todayDate.getUTCFullYear(),
            todayDate.getUTCMonth(),
            todayDate.getUTCDate() - 6
        )).toISOString().split("T")[0];

        const last7 = days.filter((d) => d.date >= sevenDaysAgo);
        const githubWeekly = last7.reduce((s, d) => s + d.githubCount, 0);
        const leetcodeWeekly = last7.reduce((s, d) => s + d.leetcodeCount, 0);

        res.status(200).json({
            success: true,
            profile: {
                githubUsername: user.githubUsername,
                leetcodeUsername: user.leetcodeUsername,
                avatar: user.avatar,
                memberSince: user.createdAt,
            },
            stats: {
                currentStreak,
                longestStreak: Math.max(longestStreak, user.longestStreak || 0),
                githubTotal,
                leetcodeTotal,
                githubWeekly,
                leetcodeWeekly,
                consistency,
                activeIn30,
                totalActiveDays: days.length,
            },
            days, // heatmap data: [{ date, githubCount, leetcodeCount, totalCount }]
        });
    } catch (err) {
        console.error("[getPublicProfile] error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─── PATCH /public/privacy ────────────────────────────────────────────────────

/**
 * Toggles the logged-in user's public profile on/off.
 * This route IS protected (uses verifyToken) — imported in authRoutes.
 *
 * Body: { isPublic: boolean }
 */
export const updatePrivacy = async (req, res) => {
    try {
        const { isPublic } = req.body;

        if (typeof isPublic !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isPublic must be a boolean",
            });
        }

        await User.findByIdAndUpdate(req.user._id, { isPublic });

        res.status(200).json({
            success: true,
            message: `Profile is now ${isPublic ? "public" : "private"}`,
            isPublic,
        });
    } catch (err) {
        console.error("[updatePrivacy] error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
