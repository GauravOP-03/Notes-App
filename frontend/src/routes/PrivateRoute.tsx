import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
    children: React.ReactNode;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;