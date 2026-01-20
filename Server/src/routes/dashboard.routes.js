import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/summary', auth, getDashboardSummary);

export default router;
