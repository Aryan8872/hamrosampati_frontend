import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRouteAdmin = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    console.log("admin route vitra")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]"></span>
      </div>
    );
  }
  if (!isLoading && user === null && isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  else if (user !== null && user.role) {
    if (user?.role?.toUpperCase() !== "ADMIN") {
      return <Navigate to="*" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;
