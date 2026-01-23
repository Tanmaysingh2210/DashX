import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUser({ email });
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setUser({ loggedIn: true });
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    useEffect(() => {
        // later: validate token / refresh
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
