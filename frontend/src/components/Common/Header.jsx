import Topbar from "../Layout/Topbar.jsx";
import Navbar from "./Navbar.jsx";
import { useLocation } from "react-router-dom";

const Header = () => {
    return (
        <>
            {/* Only show Topbar on desktop */}
            <div className="hidden md:block">
                <Topbar />
            </div>
            {/* Navbar - always visible, will stick to top on mobile */}
            <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <div className="w-full max-w-[1440px] mx-auto">
                    <Navbar transparent={true} />
                </div>
            </div>
    )
}
export default Header
