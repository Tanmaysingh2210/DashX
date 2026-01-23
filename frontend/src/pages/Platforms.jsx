import { useState, useEffect } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Platforms() {
    const [github, setGithub] = useState("");
    const [leetcode, setLeetcode] = useState("");
    const [message, setMessage] = useState("");

    const isValidUsername = value =>
        /^[a-zA-Z0-9_-]{1,39}$/.test(value);

    useEffect(() => {
        api.get("/user/platforms").then(res => {
            setGithub(res.data.github?.username || "");
            setLeetcode(res.data.leetcode?.username || "");
        });
    }, []);

    const savePlatforms = async () => {
        setMessage("");

        if (github && !isValidUsername(github)) {
            return setMessage("Invalid GitHub username format");
        }

        if (leetcode && !isValidUsername(leetcode)) {
            return setMessage("Invalid LeetCode username format");
        }

        try {
            await api.post("/user/platforms/connect", {
                github,
                leetcode
            });
            setMessage("Platforms updated successfully");
        } catch {
            setMessage("Failed to update platforms");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-lg bg-card border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Connect Platforms
                </h2>

                <label className="text-sm text-gray-400">
                    GitHub username
                </label>
                <input
                    className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    placeholder="e.g. torvalds"
                />

                <label className="text-sm text-gray-400">
                    LeetCode username
                </label>
                <input
                    className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={leetcode}
                    onChange={e => setLeetcode(e.target.value)}
                    placeholder="e.g. johndoe123"
                />

                <button
                    onClick={savePlatforms}
                    className="bg-accent text-black px-4 py-2 rounded"
                >
                    Save
                </button>

                {message && (
                    <div className="text-sm text-gray-400 mt-3">
                        {message}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
