import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setUser({ loggedIn: true });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUser({ email });
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        try {
            if (refreshToken) {
                await api.post("/auth/logout", { refreshToken });
            }
        } catch {
            // silently ignore — we still clear local state
        } finally {
            localStorage.clear();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
