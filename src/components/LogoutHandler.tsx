import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const { success } = await logout();
      if (success) {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 0);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return null;
};

export default LogoutHandler;
