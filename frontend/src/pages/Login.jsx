import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
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
            return setError("Enter a valid email address");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <form
                onSubmit={handleSubmit}
                className="bg-card border border-gray-800 p-6 rounded-xl w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Login to DashX
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
                    Login
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-accent">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
