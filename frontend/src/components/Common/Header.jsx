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
            <div className="w-full">
                <Navbar transparent={true} />
            </div>
        </>
    )
}
export default Header
