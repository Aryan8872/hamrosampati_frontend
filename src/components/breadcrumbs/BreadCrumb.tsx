import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHome } from "react-icons/fa";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const pathnames = location.pathname.split("/").filter((x) => x);

  const pathNameMap: Record<string, string> = {
    "buy": "Buy Properties",
    "rent": "Rent Properties",
    "commercial": "Commercial Spaces",
    "sell": "Sell Your Property",
    "find-agent": "Find an Agent",
    "guide": "Buying Guide",
    "blog": "Real Estate Blog",
    "property-detail": "Property Details",
    "login": "Sign In",
    "signup": "Create Account",
    "all-properties": "All Properties",
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const getDisplayName = (path: string) => {
    const name = pathNameMap[path] || path.replace(/-/g, " ");
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isMobile && pathnames.length > 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white shadow-sm"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-3 text-blue-600 font-medium w-full"
          aria-label="Go back"
        >
          <FaChevronLeft className="mr-2 h-5 w-5" />
          <span className="truncate">
            Back to {getDisplayName(pathnames[pathnames.length - 2] || "Home")}
          </span>
        </button>
      </motion.div>
    );
  }

  if (pathnames.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-label="Breadcrumb"
      className="sticky font-ManropeMedium mt-3 top-0 z-10 bg-bodyBgColor backdrop-blur-sm border-b border-gray-100 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Home"
          >
            <FaHome className="h-4 w-4" />
          </Link>
          
          {pathnames.map((path, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName = getDisplayName(path);

            return (
              <div key={path} className="flex text-sm items-center">
                <FaChevronRight className="mx-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                {isLast ? (
                  <motion.span 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-800  whitespace-nowrap"
                  >
                    {displayName}
                  </motion.span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Breadcrumbs;