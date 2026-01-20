import mongoose from 'mongoose';

const dailyActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD (user timezone)
    index: true,
    required: true
  },
  github: {
    commits: { type: Number, default: 0 }
  },
  leetcode: {
    problemsSolved: { type: Number, default: 0 }
  },
  manual: {
    score: { type: Number, default: 0 }
  },
  weightedScore: {
    type: Number,
    default: 0
  }
});

dailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyActivity', dailyActivitySchema);
