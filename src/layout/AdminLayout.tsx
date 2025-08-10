import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Admin/Header";
import Sidebar from "../components/Admin/Sidebar";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Fixed Sidebar */}
            <div className="hidden xl:block fixed left-0 top-0 h-screen w-64 z-30">
                <Sidebar />
            </div>
            {/* Main Content (scrollable) */}
            <div className="flex-1 flex flex-col xl:ml-64 h-screen overflow-y-auto font-ManropeRegular">
                <Header onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;