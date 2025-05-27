import { BACKEND_URL } from "@/config";
import { useEffect, useState } from 'react';
import { UserProp } from "@/types/schema";
import axios from "axios";
import { createContext, JSX, useContext } from "react";

interface AuthContextType {
    user: UserProp | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProp | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        const res = await axios.get(`${BACKEND_URL}/me`, { withCredentials: true });
        setUser(res.data);
    };
    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a NotesProvider");
    }
    return context;
};