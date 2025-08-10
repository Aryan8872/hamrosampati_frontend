import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectAuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user?.role?.toUpperCase() === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectAuthRoute;
