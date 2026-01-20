import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },

    title: String,
    description: String,

    metric: {
      type: String,
      enum: [
        'WEIGHTED_SCORE',
        'STREAK',
        'GITHUB_COMMITS',
        'LEETCODE_PROBLEMS'
      ],
      required: true
    },

    period: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY'],
      default: 'WEEKLY'
    },

    targetValue: Number,
    currentValue: { type: Number, default: 0 },

    deadline: Date
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);

