import mongoose from 'mongoose';

const taskLogSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    taskId: mongoose.Schema.Types.ObjectId,
    date: String, // YYYY-MM-DD (user timezone)
    weight: Number
});

export default mongoose.model('TaskLog', taskLogSchema);
