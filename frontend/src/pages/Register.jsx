import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isValidEmail = email =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            return setError("Enter a valid email");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            await api.post("/auth/register", { email, password });
            navigate("/");
        } catch (err) {
            setError("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <form
                onSubmit={handleSubmit}
                className="bg-card border border-gray-800 p-6 rounded-xl w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Create DashX Account
                </h1>

                {error && (
                    <div className="text-sm text-red-400 mb-3">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className="w-full bg-accent text-black py-2 rounded">
                    Register
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-accent">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
