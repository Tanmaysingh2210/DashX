import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },

    leetcodeUsername: {
      type: String,
      default: null,
      trim: true,
    },

    lastSynced: {
      type: Date,
      default: null,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    autoSync: {
      type: Boolean,
      default: true,
    },
    includePrivate: {
      type: Boolean,
      default: false,
    },
    weeklyReports: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);