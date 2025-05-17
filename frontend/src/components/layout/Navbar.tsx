import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, Users, Feather } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function logout() {
        // Remove cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success("Logged out successfully");
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-lg shadow-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                {/* Left: Logo */}
                <div
                    onClick={() => navigate("/notes")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Feather className="w-6 h-6 text-gray-800" />

                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">
                        Notenest
                    </h1>
                </div>

                {/* Right: Desktop Nav */}
                <div className="hidden sm:flex items-center gap-6">
                    <button
                        onClick={() => navigate("/notes")}
                        className="text-sm font-medium text-gray-700 hover:text-black transition flex items-center gap-1"
                    >
                        <Home className="w-4 h-4" /> Home
                    </button>
                    <button
                        onClick={() => navigate(`/${user?._id}/notes`)}
                        className="text-sm font-medium text-gray-700 hover:text-black transition flex items-center gap-1"
                    >
                        <Users className="w-4 h-4" /> Realtime Notes
                    </button>

                    {/* User Avatar */}
                    <div className="relative group">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow cursor-pointer"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 text-white font-bold flex items-center justify-center shadow cursor-pointer">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}

                        {/* Dropdown */}
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border rounded-lg hidden group-hover:block z-50">
                            <div className="px-4 py-3 border-b">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => navigate("/profile")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                                Profile
                            </button>
                            <button
                                onClick={logout}
                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu icon */}
                <button
                    className="sm:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden px-4 pb-4 pt-2 space-y-2 bg-white border-t border-gray-200">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                navigate("/");
                                setMobileMenuOpen(false);
                            }}
                            className="text-left text-sm px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            <Home className="inline-block w-4 h-4 mr-2" /> Home
                        </button>
                        <button
                            onClick={() => {
                                navigate("/realtime");
                                setMobileMenuOpen(false);
                            }}
                            className="text-left text-sm px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            <Users className="inline-block w-4 h-4 mr-2" /> Realtime Notes
                        </button>
                        <button
                            onClick={() => {
                                navigate("/profile");
                                setMobileMenuOpen(false);
                            }}
                            className="text-left text-sm px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="text-left text-sm px-4 py-2 rounded-md text-red-500 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
