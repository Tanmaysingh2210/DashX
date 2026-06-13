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
    },
    {
        timestamps: true,
    }
);

export default model("User", userSchema);