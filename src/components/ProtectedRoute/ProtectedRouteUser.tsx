import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRouteUser = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    console.log("user route vitra")

    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]"></span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <Outlet />;
};

export default ProtectedRouteUser;
