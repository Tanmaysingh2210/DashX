import { fetchAllGitHubContributions ,fetchCurrentYearGitHubContributions } from "./githubService.js";
import { fetchAllLeetCodeSubmissions , fetchCurrentYearLeetCodeSubmissions } from "./leetcodeService.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

// ─── merge logic ─────────────────────────────────────────────────────────────

/**
 * Merges GitHub days and LeetCode days into a unified array.
 * Both inputs have shape: [{ date: "YYYY-MM-DD", count: number }]
 *
 * Output shape: [{ date, githubCount, leetcodeCount, totalCount }]
 * Only returns days where totalCount > 0 — zero days are never stored.
 */
export const mergeDays = (githubDays, leetcodeDays) => {
  const map = new Map();

  for (const { date, count } of githubDays) {
    if (count > 0) map.set(date, { githubCount: count, leetcodeCount: 0 });
  }

  for (const { date, count } of leetcodeDays) {
    if (count > 0) {
      if (map.has(date)) {
        map.get(date).leetcodeCount = count;
      } else {
        map.set(date, { githubCount: 0, leetcodeCount: count });
      }
    }
  }

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
 * Calculates current streak and longest streak.
 * Input only contains active days (totalCount > 0) — that's all we store now.
 */
export const calculateStreaks = (activeDays) => {
  if (!activeDays.length) return { currentStreak: 0, longestStreak: 0 };

  const activeDates = new Set(activeDays.map((d) => d.date));
  const today = new Date().toISOString().split("T")[0];

  // ── longest streak ──
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate = null;

  for (const { date } of activeDays) {
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diffDays =
        (new Date(date) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, runningStreak);
    prevDate = date;
  }

  // ── current streak (walk backward from today) ──
  let currentStreak = 0;
  let checkDate = new Date(today);

  // grace period — if nothing today yet, start from yesterday
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

// ─── shared fetch + save logic ────────────────────────────────────────────────

/**
 * Fetches from both sources (full or incremental), merges, bulk-upserts,
 * and updates lastSynced.
 *
 * @param {string} userId
 * @param {string} githubUsername
 * @param {string} leetcodeUsername
 * @param {boolean} incrementalOnly - true for repeat syncs (current year only)
 */
export const fetchMergeAndSave = async (
  userId,
  githubUsername,
  leetcodeUsername,
  incrementalOnly
) => {
  const githubFn = incrementalOnly
    ? fetchCurrentYearGitHubContributions
    : fetchAllGitHubContributions;

  const leetcodeFn = incrementalOnly
    ? fetchCurrentYearLeetCodeSubmissions
    : fetchAllLeetCodeSubmissions;

  const [githubResult, leetcodeResult] = await Promise.allSettled([
    githubFn(githubUsername),
    leetcodeFn(leetcodeUsername),
  ]);

  const githubDays  = githubResult.status  === "fulfilled" ? githubResult.value  : [];
  const leetcodeDays = leetcodeResult.status === "fulfilled" ? leetcodeResult.value : [];

  const sourceErrors = {};
  if (githubResult.status === "rejected") {
    sourceErrors.github = githubResult.reason?.message || "Unknown GitHub error";
    console.error(`[Sync] GitHub fetch failed:`, sourceErrors.github);
  }
  if (leetcodeResult.status === "rejected") {
    sourceErrors.leetcode = leetcodeResult.reason?.message || "Unknown LeetCode error";
    console.error(`[Sync] LeetCode fetch failed:`, sourceErrors.leetcode);
  }

  if (githubResult.status === "rejected" && leetcodeResult.status === "rejected") {
    const err = new Error(
      `Both sources failed — GitHub: ${sourceErrors.github} | LeetCode: ${sourceErrors.leetcode}`
    );
    err.sourceErrors = sourceErrors;
    throw err;
  }

  console.log(
    `[Sync] fetched ${githubDays.length} GitHub days, ${leetcodeDays.length} LeetCode days`
  );

  // merge — only non-zero days come back from mergeDays()
  const mergedDays = mergeDays(githubDays, leetcodeDays);
  console.log(`[Sync] ${mergedDays.length} active days to save`);

  if (mergedDays.length > 0) {
    const bulkOps = mergedDays.map(({ date, githubCount, leetcodeCount, totalCount }) => ({
      updateOne: {
        filter: { userId, date },
        update: { $set: { githubCount, leetcodeCount, totalCount } },
        upsert: true,
      },
    }));

    const result = await Activity.bulkWrite(bulkOps, { ordered: false });
    console.log(
      `[Sync] DB — upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`
    );
  }

  // update lastSynced — we reached here so at least one source succeeded
  await User.findByIdAndUpdate(userId, { lastSynced: new Date() });

  return { sourceErrors };
};

// ─── main sync function ───────────────────────────────────────────────────────

/**
 * Smart sync:
 *   - FIRST sync (lastSynced === null): fetch ALL years from both sources
 *   - REPEAT sync: fetch current year only — past years never change
 *
 * For streak/stats calculation after a repeat sync, we re-read all active
 * days from the DB (already filtered to non-zero) rather than re-fetching
 * everything from the API.
 *
 * @param {string} userId
 * @param {string} githubUsername
 * @param {string} leetcodeUsername
 * @param {Date|null} lastSynced
 */
export const syncUserActivity = async (userId, githubUsername, leetcodeUsername, lastSynced) => {
  console.log(`\n[Sync] starting for user ${userId}`);

  const isFirstSync = !lastSynced;
  console.log(`[Sync] mode: ${isFirstSync ? "FULL (first sync)" : "INCREMENTAL (current year only)"}`);

  const { sourceErrors } = await fetchMergeAndSave(
    userId,
    githubUsername,
    leetcodeUsername,
    !isFirstSync  // incrementalOnly = true for repeat syncs
  );

  // read all active days from DB for accurate streak calculation
  // (much faster than re-fetching all years from the API again)
  const allActiveDays = await Activity.find({ userId })
    .sort({ date: 1 })
    .select("-_id date totalCount")
    .lean();

  const { currentStreak, longestStreak } = calculateStreaks(allActiveDays);
  const totalDays = allActiveDays.length; // every doc is active (totalCount > 0)
  const totalContributions = allActiveDays.reduce((s, d) => s + d.totalCount, 0);

  console.log(
    `[Sync] done — streak: ${currentStreak}, longest: ${longestStreak}, total: ${totalContributions}, docs: ${totalDays}`
  );

  return {
    currentStreak,
    longestStreak,
    totalDays,
    totalContributions,
    ...(Object.keys(sourceErrors).length > 0 && { sourceErrors }),
  };
};