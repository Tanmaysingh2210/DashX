import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import {
  getTodayActivity,
  updateActivity
} from '../controllers/activity.controller.js';

const router = Router();

router.get('/today', auth, getTodayActivity);
router.post('/update', auth, updateActivity);

export default router;
