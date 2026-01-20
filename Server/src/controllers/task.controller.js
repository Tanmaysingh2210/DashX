import Task from '../models/Task.js';
import TaskLog from '../models/TaskLog.js';
import User from '../models/User.js';
import DailyActivity from '../models/DailyActivity.js';
import { getUserDate } from '../utils/date.js';
import { updateGoalsForUser } from '../utils/goalUpdater.js';

export const createTask = async (req, res) => {
    const { title, weight } = req.body;

    const task = await Task.create({
        userId: req.userId,
        title,
        weight
    });

    res.status(201).json(task);
};

export const completeTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.sendStatus(404);

    const user = await User.findById(req.userId);
    const date = getUserDate(user.settings.timezone);

    await TaskLog.create({
        userId: req.userId,
        taskId: task._id,
        date,
        weight: task.weight
    });

    await DailyActivity.findOneAndUpdate(
        { userId: req.userId, date },
        {
            $inc: {
                'manual.score': task.weight,
                weightedScore: task.weight
            }
        },
        { upsert: true }
    );

    await updateGoalsForUser(req.userId);

    res.json({ message: 'Task completed', weight: task.weight });
};
