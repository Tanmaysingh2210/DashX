import { Router } from 'express';
import { dailySync } from '../controllers/sync.controller.js';

const router = Router();

// simple shared secret for cron
router.post('/daily', (req, res, next) => {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers['x-cron-secret'] !== cronSecret) {
    return res.sendStatus(403);
  }
  next();
}, dailySync);

export default router;
