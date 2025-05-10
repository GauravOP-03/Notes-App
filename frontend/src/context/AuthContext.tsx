import { BACKEND_URL } from "@/config";
import { useEffect } from 'react';
import { UserProp } from "@/types/schema";
import axios from "axios";
import { createContext, JSX, useContext, useState } from "react";

interface AuthContextType {
    user: UserProp | null;
    login: () => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProp | null>(null);

    const login = async () => {
        const res = await axios.get(`${BACKEND_URL}/me`, { withCredentials: true, })
        console.log(res.data)
        setUser(res.data);
    };
    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        login();
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within a NotesProvider")
    }
    return context;
}