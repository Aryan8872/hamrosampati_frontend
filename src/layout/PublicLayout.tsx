import { Outlet, useLocation } from "react-router-dom"
import Footer from "../footer/Footer"
import TheNavbar from "../components/navbar/TheNavbar";

const PublicLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col">
            <TheNavbar isHomePage={isHomePage} />

            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout
