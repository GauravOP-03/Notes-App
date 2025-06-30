import {
    GoogleAuthProvider,
    signInWithPopup,

} from "firebase/auth";

import { auth } from "@/FirebaseConfig";
import axios from "axios";
// import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
export default function GoogleLogin() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseToken = await result.user.getIdToken();

        // Send to your backend to verify and generate YOUR JWT
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/google-login`, {
                token: firebaseToken,
            }, { withCredentials: true });
            //   localStorage.setItem("token", res.data.token);

            await login();


            toast.success("Logged in successfully", { description: "Redirecting to Main Page..." })
            navigate("/notes");
            console.log("Logged in via Firebase email");
        } catch (e) {
            // console.log(e);
            let errorMessage = "Please try again later";
            if (axios.isAxiosError(e) && e.response && e.response.data && typeof e.response.data.message === "string") {
                errorMessage = e.response.data.message;
            }
            toast.error("Error logging in", { description: errorMessage });
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={googleLogin}
            disabled={loading}
            aria-label="Sign in with Google"
            className="flex items-center justify-center gap-3 w-full px-5 py-2.5 bg-white border border-gray-300 rounded-lg shadow transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            {loading ? (
                <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    ></path>
                </svg>
            ) : (
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                />
            )}
            <span className="text-sm font-semibold text-gray-700">
                {loading ? "Signing in..." : "Sign in with Google"}
            </span>
        </button>


    )
}