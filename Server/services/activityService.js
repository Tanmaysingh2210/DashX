import { fetchAllGitHubContributions } from "./githubService.js";
import { fetchAllLeetCodeSubmissions } from "./leetcodeService.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";


// ─── merge logic ─────────────────────────────────────────────────────────────

/**
 * Merges GitHub days and LeetCode days into a unified array.
 * Both inputs have shape: [{ date: "YYYY-MM-DD", count: number }]
 *
 * Output shape: [{ date, githubCount, leetcodeCount, totalCount }]
 *
 * Uses a Map keyed by date for O(n) merge — no nested loops.
 *
 * @param {Array<{ date: string, count: number }>} githubDays
 * @param {Array<{ date: string, count: number }>} leetcodeDays
 * @returns {Array<{ date: string, githubCount: number, leetcodeCount: number, totalCount: number }>}
 */
export const mergeDays = (githubDays, leetcodeDays) => {
  const map = new Map();

  // load github days
  for (const { date, count } of githubDays) {
    map.set(date, { githubCount: count, leetcodeCount: 0 });
  }

  // merge leetcode days on top
  for (const { date, count } of leetcodeDays) {
    if (map.has(date)) {
      map.get(date).leetcodeCount = count;
    } else {
      map.set(date, { githubCount: 0, leetcodeCount: count });
    }
  }

  // flatten to array, compute totalCount, sort ascending
  return Array.from(map.entries())
    .map(([date, { githubCount, leetcodeCount }]) => ({
      date,
      githubCount,
      leetcodeCount,
      totalCount: githubCount + leetcodeCount,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
};

// ─── streak calculator ────────────────────────────────────────────────────────

/**
 * Calculates current streak and longest streak from merged activity.
 *
 * Current streak: consecutive days ending today (or yesterday if nothing today yet)
 * Longest streak: max consecutive active days ever
 *
 * @param {Array<{ date: string, totalCount: number }>} mergedDays sorted ascending
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export const calculateStreaks = (mergedDays) => {
  if (!mergedDays.length) return { currentStreak: 0, longestStreak: 0 };

  // build a Set of active dates for O(1) lookup
  const activeDates = new Set(
    mergedDays.filter((d) => d.totalCount > 0).map((d) => d.date)
  );

  const today = new Date().toISOString().split("T")[0];

  // ── longest streak (sliding window) ──
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate = null;

  for (const { date, totalCount } of mergedDays) {
    if (totalCount === 0) {
      runningStreak = 0;
      prevDate = null;
      continue;
    }

    if (!prevDate) {
      runningStreak = 1;
    } else {
      // check if this date is exactly 1 day after previous active date
      const prev = new Date(prevDate);
      const curr = new Date(date);
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        runningStreak++;
      } else {
        runningStreak = 1; // gap — reset
      }
    }

    longestStreak = Math.max(longestStreak, runningStreak);
    prevDate = date;
  }

  // ── current streak (walk backward from today) ──
  let currentStreak = 0;
  let checkDate = new Date(today);

  // if nothing today yet, start from yesterday (grace period)
  if (!activeDates.has(today)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (!activeDates.has(dateStr)) break;
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { currentStreak, longestStreak };
};

// ─── main sync function ───────────────────────────────────────────────────────

/**
 * Full sync pipeline for one user:
 *   1. Fetch GitHub contributions
 *   2. Fetch LeetCode submissions
 *   3. Merge by date
 *   4. Bulk upsert into Activity collection
 *   5. Update user.lastSynced
 *
 * Uses bulkWrite with upsert so re-syncing is safe — no duplicates.
 *
 * @param {string} userId         - MongoDB user _id
 * @param {string} githubUsername
 * @param {string} leetcodeUsername
 * @returns {{ currentStreak, longestStreak, totalDays, totalContributions }}
 */
export const syncUserActivity = async (userId, githubUsername, leetcodeUsername) => {
  console.log(`\n[Sync] starting for user ${userId}`);
  console.log(`[Sync] GitHub: ${githubUsername} | LeetCode: ${leetcodeUsername}`);

  // ── step 1 & 2 — fetch both, but don't let one failure kill the other ──
  // Promise.allSettled instead of Promise.all: if GitHub's PAT is bad or
  // LeetCode returns a 403, we still want to save whatever DID succeed
  // and update lastSynced — not crash silently.
  const [githubResult, leetcodeResult] = await Promise.allSettled([
    fetchAllGitHubContributions(githubUsername),
    fetchAllLeetCodeSubmissions(leetcodeUsername),
  ]);

  const githubDays = githubResult.status === "fulfilled" ? githubResult.value : [];
  const leetcodeDays = leetcodeResult.status === "fulfilled" ? leetcodeResult.value : [];

  const sourceErrors = {};
  if (githubResult.status === "rejected") {
    sourceErrors.github = githubResult.reason?.message || "Unknown GitHub error";
    console.error(`[Sync] GitHub fetch failed for ${githubUsername}:`, sourceErrors.github);
  }
  if (leetcodeResult.status === "rejected") {
    sourceErrors.leetcode = leetcodeResult.reason?.message || "Unknown LeetCode error";
    console.error(`[Sync] LeetCode fetch failed for ${leetcodeUsername}:`, sourceErrors.leetcode);
  }

  // if BOTH sources failed, there's nothing to save — surface the error
  // and do NOT update lastSynced, so the user can retry sooner
  if (githubResult.status === "rejected" && leetcodeResult.status === "rejected") {
    const err = new Error(
      `Sync failed for both sources — GitHub: ${sourceErrors.github} | LeetCode: ${sourceErrors.leetcode}`
    );
    err.sourceErrors = sourceErrors;
    throw err;
  }


  console.log(`[Sync] fetched ${githubDays.length} GitHub days, ${leetcodeDays.length} LeetCode days`);

  // ── step 3 — merge ──
  const mergedDays = mergeDays(githubDays, leetcodeDays);
  console.log(`[Sync] merged into ${mergedDays.length} unique days`);

  // ── step 4 — bulk upsert into MongoDB ──
  // upsert = insert if not exists, update if exists
  // this makes re-sync safe — no duplicate documents
  const bulkOps = mergedDays.map(({ date, githubCount, leetcodeCount, totalCount }) => ({
    updateOne: {
      filter: { userId, date },
      update: { $set: { githubCount, leetcodeCount, totalCount } },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    const result = await Activity.bulkWrite(bulkOps, { ordered: false });
    console.log(
      `[Sync] DB write — upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`
    );
  }

  // ── step 5 — update lastSynced on user ──
  // we reach here as long as AT LEAST ONE source succeeded
  await User.findByIdAndUpdate(userId, { lastSynced: new Date() });

  // ── compute summary stats ──
  const { currentStreak, longestStreak } = calculateStreaks(mergedDays);
  const totalDays = mergedDays.filter((d) => d.totalCount > 0).length;
  const totalContributions = mergedDays.reduce((sum, d) => sum + d.totalCount, 0);

  console.log(`[Sync] done — streak: ${currentStreak}, longest: ${longestStreak}, total: ${totalContributions}`);

  return {
    currentStreak,
    longestStreak,
    totalDays,
    totalContributions,
    // present only if a source partially failed — frontend can surface this
    ...(Object.keys(sourceErrors).length > 0 && { sourceErrors }),
  };
};
