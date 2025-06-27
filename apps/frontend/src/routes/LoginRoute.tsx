import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface LoginRouteProp {
    children: React.ReactNode;
}

export default function LoginRoute({ children }: LoginRouteProp) {
    const { loading, user } = useAuth();
    const hasShownToast = useRef(false);
    const location = useLocation();
    const redirected = new URLSearchParams(location.search).get("redirected");

    useEffect(() => {
        if (!loading && !user && !hasShownToast.current) {
            toast.error("Session expired. Please login again.", {
                description: "You will be redirected to the login page.",
            });
            hasShownToast.current = true;
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600 mb-4" />
                <span className="text-lg text-muted-foreground">Loading elements...</span>
            </div>
        );
    }


    if (user && redirected === "true") {
        return <Navigate to="/notes" />;
    }

    // If user is not logged in, render the children (LoginForm)
    return <>{children}</>;
}
