import { useState, useEffect } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Platforms() {
    const [githubUrl, setGithubUrl] = useState("");
    const [leetcodeUrl, setLeetcodeUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError]  = useState("");

    // Load existing connected platforms on mount
    useEffect(() => {
        api.get("/user/platforms")
            .then(res => {
                setGithubUrl(res.data.github?.profileUrl || "");
                setLeetcodeUrl(res.data.leetcode?.profileUrl || "");
            })
            .catch(() => {}); // silently ignore if not connected
    }, []);

    const savePlatforms = async () => {
        setMessage("");
        setError("");

        try {
            // Connect GitHub if URL provided
            if (githubUrl.trim()) {
                await api.post("/user/platforms/connect", {
                    platform: "github",
                    profileUrl: githubUrl.trim()
                });
            }

            // Connect LeetCode if URL provided
            if (leetcodeUrl.trim()) {
                await api.post("/user/platforms/connect", {
                    platform: "leetcode",
                    profileUrl: leetcodeUrl.trim()
                });
            }

            setMessage("Platforms updated successfully");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update platforms";
            setError(msg);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-lg bg-card border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Connect Platforms
                </h2>

                <label className="text-sm text-gray-400">GitHub profile URL</label>
                <input
                    className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/torvalds"
                />

                <label className="text-sm text-gray-400">LeetCode profile URL</label>
                <input
                    className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={leetcodeUrl}
                    onChange={e => setLeetcodeUrl(e.target.value)}
                    placeholder="https://leetcode.com/u/johndoe"
                />

                <button
                    onClick={savePlatforms}
                    className="bg-accent text-black px-4 py-2 rounded"
                >
                    Save
                </button>

                {message && (
                    <div className="text-sm text-green-400 mt-3">{message}</div>
                )}
                {error && (
                    <div className="text-sm text-red-400 mt-3">{error}</div>
                )}
            </div>
        </DashboardLayout>
    );
}
