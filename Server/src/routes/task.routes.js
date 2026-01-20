import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import {
  createTask,
  completeTask
} from '../controllers/task.controller.js';

const router = Router();

router.post('/', auth, createTask);
router.post('/:id/complete', auth, completeTask);

export default router;
