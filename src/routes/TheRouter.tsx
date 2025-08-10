import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LogoutHandler from "../components/LogoutHandler";
import ProtectedRouteAdmin from "../components/ProtectedRoute/ProtectedRouteAdmin";
import ProtectedRouteUser from "../components/ProtectedRoute/ProtectedRouteUser";

import BlogList from "../components/Admin/Blogs/BlogList";
import AdminTourBookingList from "../components/Admin/TourBookings/AdminTourBookingList";
import BlogDetail from "../components/blog/BlogDetail";
import ProtectAuthRoute from "../components/ProtectedRoute/ProtectAuthRoute";
import ScrollToTop from "../components/ScrollTop";
import TourRequestDetail from "../components/TourRequest/TourRequestDetails";
import TourRequestList from "../components/TourRequest/TourRequestList";
import AdminLayout from "../layout/AdminLayout";
import PublicLayout from "../layout/PublicLayout";
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';
import FavoritesPage from "../pages/FavoriteProperties";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const RealEstateDashboard = lazy(() => import("../pages/Admin"));
const PrimeLocationDetail = lazy(() => import("../pages/PrimeLocationDetail"));
const TheAbout = lazy(() => import("../pages/TheAbout"));
const TheBlog = lazy(() => import("../pages/TheBlog"));
const TheBuy = lazy(() => import("../pages/TheBuy"));
const TheCommercial = lazy(() => import("../pages/TheCommercial"));
const TheDetailPage = lazy(() => import("../pages/TheDetailpage"));
const Error_page = lazy(() => import("../pages/Error_page"));
const TheFindAgent = lazy(() => import("../pages/TheFindAgent"));
const TheGuide = lazy(() => import("../pages/TheGuide"));
const TheHome = lazy(() => import("../pages/TheHome"));
const TheLogin = lazy(() => import("../pages/TheLogin"));
const TheRent = lazy(() => import("../pages/TheRent"));
const TheSell = lazy(() => import("../pages/TheSell"));
const TheSignUp = lazy(() => import("../pages/TheSignUp"));
const TheViewMore = lazy(() => import("../pages/PropertyBrowse"));


const TheRouter = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-[100vh]]">
      <ScrollToTop />
      <Suspense fallback={<div className="flex justify-center items-center h-full min-h-screen"><span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]"></span></div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<TheHome />} />
              <Route path="/buy" element={<TheBuy />} />
              <Route path="/rent" element={<TheRent />} />
              <Route path="/commercial" element={<TheCommercial />} />
              <Route path="/sell" element={<TheSell />} />
              <Route path="/find-agent" element={<TheFindAgent />} />
              <Route path="/guide" element={<TheGuide />} />
              <Route path="/blog" element={<TheBlog />} />
              <Route path="/about" element={<TheAbout />} />
              <Route path="/property-detail/:propertyId/" element={<TheDetailPage />} />
              <Route path="/all-properties" element={<TheViewMore />} />
              <Route path="/all-properties/apartment" element={<TheViewMore />} />
              <Route path="/all-properties/house" element={<TheViewMore />} />
              <Route path="/all-properties/building" element={<TheViewMore />} />
              <Route path="/all-properties/store" element={<TheViewMore />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/locations/:city" element={<PrimeLocationDetail />} />
              <Route path="*" element={<Error_page />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/tour-history" element={<TourRequestList />} />
              <Route path="/tours/:tourId" element={<TourRequestDetail />} />
              <Route path="/edit-profile" element={<EditProfile />} />

            </Route>
            <Route path="/logout" element={<LogoutHandler />} />


            <Route element={<ProtectedRouteUser />}>
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/tour-history" element={<TourRequestList />} />
              <Route path="/tours/:tourId" element={<TourRequestDetail />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            <Route element={<ProtectedRouteAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<RealEstateDashboard />} />
                <Route path="/admin-tour-bookings" element={<AdminTourBookingList />} />
                <Route path="/admin-blogs" element={<BlogList />} />
              </Route>
            </Route>

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />


            <Route
              path="/login"
              element={
                <ProtectAuthRoute>
                  <TheLogin />
                </ProtectAuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectAuthRoute>
                  <TheSignUp />
                </ProtectAuthRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default TheRouter;
