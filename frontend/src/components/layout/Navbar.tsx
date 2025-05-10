import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 shadow-sm">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-800">
                    ✨ All Notes
                </h1>

                <div className="relative group">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm cursor-pointer"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold shadow-md cursor-pointer">
                            {user?.username?.[0]}
                        </div>
                    )}

                    <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white/90 border border-gray-200 hidden group-hover:block">
                        <div className="flex flex-col p-2">
                            <button className="hover:bg-gray-100 text-left px-4 py-2 rounded-md">Profile</button>
                            <button onClick={logout} className="hover:bg-gray-100 text-left px-4 py-2 rounded-md">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
