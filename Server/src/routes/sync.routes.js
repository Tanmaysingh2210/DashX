import { Router } from 'express';
import { dailySync } from '../controllers/sync.controller.js';

const router = Router();

// simple shared secret for cron
router.post('/daily', (req, res, next) => {
  if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    return res.sendStatus(403);
  }
  next();
}, dailySync);

export default router;
