import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import {
  connectPlatform,
  disconnectPlatform,
  getPlatforms
} from '../controllers/user.controller.js';

const router = Router();

router.get('/platforms', auth, getPlatforms);
router.post('/platforms/connect', auth, connectPlatform);
router.delete('/platforms/:platform', auth, disconnectPlatform);

export default router;
