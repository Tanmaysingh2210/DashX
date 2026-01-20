import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    title: String,
    weight: Number
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
