// import { BACKEND_URL } from "@/config";
import { useEffect, useState, createContext, JSX, useContext, useRef } from 'react';
import { UserProp } from "@/types/schema";
import axios from "axios";
import { setAccessTokenRef } from "@/lib/axiosInstance";

interface AuthContextType {
    user: UserProp | null;
    accessToken: React.RefObject<string | null>;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProp | null>(null);
    const [loading, setLoading] = useState(true);
    const accessToken = useRef<string | null>(null);

    useEffect(() => {
        setAccessTokenRef(accessToken);
    }, [])

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken.current}`
                }
            })
            setUser(res.data);
        } catch (e: unknown) {
            // console.log(e)
            if (axios.isAxiosError(e) && e.response?.status === 401) {
                // console.log("running")
                try {
                    const refreshRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh-token`, {}, { withCredentials: true });
                    // console.log(refreshRes.data.accessToken)
                    const newAccessToken = refreshRes.data.accessToken;
                    accessToken.current = newAccessToken;
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, {
                        headers: {
                            Authorization: `Bearer ${accessToken.current}`
                        }
                    })
                    // console.log(res)
                    setUser(res.data);
                } catch {
                    console.warn("Refresh Token invalid");
                    setUser(null);
                }
            } else {
                console.error('Error fetching user', e);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }


    const login = async () => {
        // const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, { withCredentials: true });
        // setUser(res.data);
        accessToken.current = null;
        await fetchUser();
    };
    const logout = async () => {
        await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/logout`,
            {}, // No body data
            {
                headers: {
                    Authorization: `Bearer ${accessToken.current}`,
                },
                withCredentials: true,
            }
        );

        setUser(null);
        accessToken.current = null;
    };

    useEffect(() => {
        // axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, { withCredentials: true })
        //     .then(res => setUser(res.data))
        //     .catch(() => setUser(null))
        //     .finally(() => setLoading(false));
        fetchUser();

    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, accessToken }}>
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