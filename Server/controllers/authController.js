import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { syncUserActivity } from "../services/activityService.js";


// /**
//  * Signs a JWT with the user's MongoDB _id as the payload.
//  * Short expiry on access token, long on refresh.
//  */
// const signToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });

// /**
//  * Attaches the JWT as an httpOnly cookie so JS on the client
//  * can never read or steal it (XSS protection).
//  */
// const attachCookie = (res, token) => {
//   res.cookie("dashx_token", token, {
//     httpOnly: true,                          // not accessible via JS
//     secure: process.env.NODE_ENV === "production", // HTTPS only in prod
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, 
//   });
// };


// /**
//  * GET /auth/github
//  *
//  * Entry point — passport redirects user to GitHub's OAuth consent page.
//  * Nothing to do here, passport handles it entirely via the route middleware.
//  */
// export const githubLogin = (req, res) => {
//   // this controller is never actually called —
//   // passport.authenticate("github") intercepts before it gets here.
//   // kept for clarity in the route file.
// };

// /**
//  * GET /auth/github/callback
//  *
//  * GitHub redirects back here after user approves.
//  * At this point passport has already:
//  *   1. Exchanged the code for an access token
//  *   2. Fetched the GitHub profile
//  *   3. Run our GitHubStrategy verify callback (find/create user in DB)
//  *   4. Attached the user to req.user
//  *
//  * Our job: issue a JWT, set the cookie, redirect to frontend.
//  */
// export const githubCallback = (req, res) => {
//   try {
//     const token = signToken(req.user._id);
//     attachCookie(res, token);

//     // redirect to dashboard — frontend reads the cookie automatically
//     // if leetcodeUsername is not set yet, frontend shows the setup prompt
//     const redirectTo =
//       req.user.leetcodeUsername
//         ? `${process.env.CLIENT_URL}/dashboard`
//         : `${process.env.CLIENT_URL}/setup`; // setup page to add LeetCode username

//     res.redirect(redirectTo);
//   } catch (err) {
//     console.error("[githubCallback] error:", err.message);
//     res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
//   }
// };

// /**
//  * GET /auth/me
//  *
//  * Returns the currently logged-in user's profile.
//  * Protected by verifyToken middleware — req.user is already populated.
//  */
// export const getMe = (req, res) => {
//   const { _id, githubUsername, leetcodeUsername, avatar, email, lastSynced, createdAt } =
//     req.user;

//   res.status(200).json({
//     success: true,
//     user: {
//       id: _id,
//       githubUsername,
//       leetcodeUsername,
//       avatar,
//       email,
//       lastSynced,
//       joinedAt: createdAt,
//       isSetupComplete: !!leetcodeUsername, // frontend uses this to show setup prompt
//     },
//   });
// };

// /**
//  * PATCH /auth/setup-leetcode
//  *
//  * Called from the setup page after GitHub login.
//  * Saves the user's LeetCode username.
//  *
//  * Body: { leetcodeUsername: "tanmay123" }
//  */
// export const setupLeetcode = async (req, res) => {
//   try {
//     const { leetcodeUsername } = req.body;

//     if (!leetcodeUsername || typeof leetcodeUsername !== "string") {
//       return res.status(400).json({
//         success: false,
//         message: "leetcodeUsername is required",
//       });
//     }

//     const cleaned = leetcodeUsername.trim();

//     if (cleaned.length < 2 || cleaned.length > 40) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid LeetCode username length",
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { leetcodeUsername: cleaned },
//       { new: true } // return updated doc
//     );

//     res.status(200).json({
//       success: true,
//       message: "LeetCode username saved",
//       user: {
//         id: user._id,
//         githubUsername: user.githubUsername,
//         leetcodeUsername: user.leetcodeUsername,
//         avatar: user.avatar,
//         isSetupComplete: true,
//       },
//     });
//   } catch (err) {
//     console.error("[setupLeetcode] error:", err.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /**
//  * POST /auth/logout
//  *
//  * Clears the JWT cookie. No DB change needed since we're stateless.
//  */
// export const logout = (req, res) => {
//   res.clearCookie("dashx_token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   });

//   res.status(200).json({ success: true, message: "Logged out" });
// };


















// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Signs a JWT with the user's MongoDB _id as the payload.
 * Short expiry on access token, long on refresh.
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/**
 * Attaches the JWT as an httpOnly cookie so JS on the client
 * can never read or steal it (XSS protection).
 */
const attachCookie = (res, token) => {
  res.cookie("dashx_token", token, {
    httpOnly: true,                          // not accessible via JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in ms
  });
};

// ─── controllers ────────────────────────────────────────────────────────────

/**
 * GET /auth/github
 *
 * Entry point — passport redirects user to GitHub's OAuth consent page.
 * Nothing to do here, passport handles it entirely via the route middleware.
 */
export const githubLogin = (req, res) => {
  // this controller is never actually called —
  // passport.authenticate("github") intercepts before it gets here.
  // kept for clarity in the route file.
};

/**
 * GET /auth/github/callback
 *
 * GitHub redirects back here after user approves.
 * At this point passport has already:
 *   1. Exchanged the code for an access token
 *   2. Fetched the GitHub profile
 *   3. Run our GitHubStrategy verify callback (find/create user in DB)
 *   4. Attached the user to req.user
 *
 * Our job: issue a JWT, set the cookie, redirect to frontend.
 */
export const githubCallback = (req, res) => {
  try {
    const token = signToken(req.user._id);
    attachCookie(res, token);

    // redirect to dashboard — frontend reads the cookie automatically
    // if leetcodeUsername is not set yet, frontend shows the setup prompt
    const redirectTo =
      req.user.leetcodeUsername
        ? `${process.env.CLIENT_URL}/dashboard`
        : `${process.env.CLIENT_URL}/setup`; // setup page to add LeetCode username

    res.redirect(redirectTo);
  } catch (err) {
    console.error("[githubCallback] error:", err.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

/**
 * GET /auth/me
 *
 * Returns the currently logged-in user's profile.
 * Protected by verifyToken middleware — req.user is already populated.
 */
export const getMe = (req, res) => {
  const { _id, githubUsername, leetcodeUsername, avatar, email, lastSynced, createdAt } =
    req.user;

  res.status(200).json({
    success: true,
    user: {
      id: _id,
      githubUsername,
      leetcodeUsername,
      avatar,
      email,
      lastSynced,
      joinedAt: createdAt,
      isSetupComplete: !!leetcodeUsername, // frontend uses this to show setup prompt
    },
  });
};

/**
 * PATCH /auth/setup-leetcode
 *
 * Called from the setup page after GitHub login.
 * Saves the user's LeetCode username.
 *
 * Body: { leetcodeUsername: "tanmay123" }
 */
export const setupLeetcode = async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;

    if (!leetcodeUsername || typeof leetcodeUsername !== "string") {
      return res.status(400).json({
        success: false,
        message: "leetcodeUsername is required",
      });
    }

    const cleaned = leetcodeUsername.trim();

    if (cleaned.length < 2 || cleaned.length > 40) {
      return res.status(400).json({
        success: false,
        message: "Invalid LeetCode username length",
      });
    }

    // save LeetCode username to DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { leetcodeUsername: cleaned },
      { new: true }
    );

    // respond immediately — don't make the user wait for the full sync
    res.status(200).json({
      success: true,
      message: "LeetCode username saved. Initial sync started in background.",
      user: {
        id: user._id,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
        avatar: user.avatar,
        isSetupComplete: true,
      },
    });

    // trigger first sync in background AFTER response is sent
    // this way the setup page doesn't hang waiting for all-years fetch
    // frontend can poll GET /activity/stats until lastSynced is populated
    syncUserActivity(user._id, user.githubUsername, cleaned)
      .then(() => console.log(`[Setup] first sync complete for ${user.githubUsername}`))
      .catch((err) => console.error(`[Setup] first sync failed for ${user.githubUsername}:`, err.message));

  } catch (err) {
    console.error("[setupLeetcode] error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /auth/logout
 *
 * Clears the JWT cookie. No DB change needed since we're stateless.
 */
export const logout = (req, res) => {
  res.clearCookie("dashx_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out" });
};