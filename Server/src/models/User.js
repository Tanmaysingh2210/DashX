import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
    username: String,
    profileUrl: String,
    connected: { type: Boolean, default: false },
    lastSyncedAt: Date
});

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },

        profile: {
            name: String,
            avatarUrl: String
        },

        platforms: {
            github: platformSchema,
            leetcode: platformSchema
        },
        settings: {
            timezone: {
                type: String,
                default: 'UTC' // e.g. "Asia/Kolkata"
            }
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
