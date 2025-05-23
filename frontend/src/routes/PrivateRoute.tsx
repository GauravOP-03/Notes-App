import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
interface PrivateRouteProps {
    children: React.ReactNode;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600 mb-4" />
                <span className="text-lg text-muted-foreground">Loading elements...</span>
            </div>
        );
    }
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;