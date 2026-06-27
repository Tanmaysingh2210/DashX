import express from "express";
import { getPublicProfile, updatePrivacy } from "../controllers/publicController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
/**
 * GET /public/:username
 * Fully public — no auth required.
 * Returns profile + heatmap data for a given GitHub username.
 */
router.get("/:username", getPublicProfile);

/**
 * PATCH /public/privacy
 * Protected — toggles the logged-in user's isPublic flag.
 * Body: { isPublic: boolean }
 */
router.patch("/privacy", verifyToken, updatePrivacy);

export default router;