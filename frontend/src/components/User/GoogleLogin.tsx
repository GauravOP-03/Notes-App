import {
    GoogleAuthProvider,
    signInWithPopup,

} from "firebase/auth";

import { auth } from "@/FirebaseConfig";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
export default function GoogleLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseToken = await result.user.getIdToken();

        // Send to your backend to verify and generate YOUR JWT
        await axios.post(`${BACKEND_URL}/google-login`, {
            token: firebaseToken,
        }, { withCredentials: true });
        //   localStorage.setItem("token", res.data.token);

        await login();

        navigate("/notes");
        console.log("Logged in via Firebase email");
    }

    return (
        <div onClick={googleLogin}>
            <a href="#">Sign in with Google</a>
        </div>
    )
}