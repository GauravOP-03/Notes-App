import { useState } from "react";
import { Menu, X, Home, Users, Feather, User, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
    // Mock user data and functions for demo
    const { user } = useAuth();
    const navigate = useNavigate();



    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success("Logged out successfully");
        navigate("/login");
    }

    const navItems = [
        { icon: Home, label: "Home", path: "/notes" },
        { icon: Users, label: "Realtime Notes", path: `/${user?._id}/notes` }
    ];

    return (
        <header className="sticky top-0 z-40 w-full">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-violet-50/30 to-white opacity-60"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-3 cursor-pointer"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-gradient-to-br from-gray-800 to-black p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <Feather className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent tracking-tight">
                            Notenest
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-8">
                            {/* Navigation Links */}
                            <nav className="flex items-center gap-6">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-white/60"
                                    >
                                        <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                        <span>{item.label}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                ))}
                            </nav>

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-300"
                                >

                                    {user?.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt="Avatar"
                                            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-violet-300 transition-all duration-300"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white font-semibold flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                            {user?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div className="hidden xl:block text-left">
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-24">
                                            {user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate max-w-24">
                                            {user?.email}
                                        </p>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden z-50">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/20 to-white"></div>

                                        {/* User Info Header */}
                                        <div className="relative px-4 py-4 border-b border-gray-100/50">
                                            <div className="flex items-center gap-3">
                                                {user?.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt="Avatar"
                                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white font-semibold flex items-center justify-center shadow-lg">
                                                        {user?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-800">{user?.username}</p>
                                                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="relative py-2">
                                            <button
                                                onClick={() => {
                                                    navigate("/profile");
                                                    setProfileDropdownOpen(false);
                                                }}
                                                className="group w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-violet-50/50 transition-all duration-200"
                                            >
                                                <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                <span>Profile Settings</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate("/settings");
                                                    setProfileDropdownOpen(false);
                                                }}
                                                className="group w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-violet-50/50 transition-all duration-200"
                                            >
                                                <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                <span>Preferences</span>
                                            </button>
                                            <div className="border-t border-gray-100/50 my-2"></div>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setProfileDropdownOpen(false);
                                                }}
                                                className="group w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
                                            >
                                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    {user && (
                        <button
                            className="lg:hidden relative p-2 rounded-xl hover:bg-white/60 transition-all duration-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            {mobileMenuOpen ? (
                                <X className="relative w-6 h-6 z-50 text-gray-700" />
                            ) : (
                                <Menu className="relative w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && user && (
                <div className="lg:hidden border-t border-gray-200/50">
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/30 to-white"></div>

                    <div className="relative max-w-7xl mx-auto px-4 py-4 space-y-2">
                        {/* Navigation Items */}
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileMenuOpen(false);
                                }}
                                className="group w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-300"
                            >
                                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                <span>{item.label}</span>
                            </button>
                        ))}

                        <div className="border-t border-gray-200/50 my-4"></div>

                        {/* User Section */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white font-semibold flex items-center justify-center shadow-lg">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-800">{user?.username}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Profile Actions */}
                        <button
                            onClick={() => {
                                navigate("/profile");
                                setMobileMenuOpen(false);
                            }}
                            className="group w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-300"
                        >
                            <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>Profile Settings</span>
                        </button>

                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="group w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-300"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {profileDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                ></div>
            )}
        </header>
    );
}