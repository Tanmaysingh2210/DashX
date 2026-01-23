import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import rateLimit from 'express-rate-limit';

import dashboardRoutes from './routes/dashboard.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import goalRoutes from './routes/goal.routes.js';
import activityRoutes from './routes/activity.routes.js';
import syncRoutes from './routes/sync.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/internal/sync', syncRoutes);

export default app;
