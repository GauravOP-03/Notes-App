import { UserProp } from "@/types/schema";
import { createContext, JSX, useContext, useState } from "react";

interface AuthContextType {
    user: UserProp | null;
    login: (userData: UserProp) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProp | null>(() => {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    });

    const login = (userData: UserProp) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

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