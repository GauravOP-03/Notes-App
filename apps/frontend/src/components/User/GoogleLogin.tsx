import {
    GoogleAuthProvider,
    signInWithPopup,

} from "firebase/auth";

import { auth } from "@/FirebaseConfig";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
export default function GoogleLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseToken = await result.user.getIdToken();

        // Send to your backend to verify and generate YOUR JWT
        try {

            await axios.post(`${BACKEND_URL}/google-login`, {
                token: firebaseToken,
            }, { withCredentials: true });
            //   localStorage.setItem("token", res.data.token);

            await login();


            toast.success("Logged in successfully", { description: "Redirecting to Main Page..." })
            navigate("/notes");
            console.log("Logged in via Firebase email");
        } catch (e) {
            // console.log(e.response.data.message);
            toast.error("Error logging in", { description: e.response.data.message || "Please try again later" });
        }
    }

    return (
        <button
            onClick={googleLogin}
            className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-5 py-2 shadow hover:shadow-md transition-all duration-200"
        >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>

    )
}