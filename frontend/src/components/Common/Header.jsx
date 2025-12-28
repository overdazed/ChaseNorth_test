import Topbar from "../Layout/Topbar.jsx";
import Navbar from "./Navbar.jsx";
import { useLocation } from "react-router-dom";

const Header = () => {
    return (
        <>
            {/* Topbar - Only show on collection pages */}
            <div className="bg-transparent">
                <Topbar transparent={true}/>
            </div>
            {/* Header with Navbar - Sticky with transparent background */}
            <header className="sticky top-8 z-40 w-full">
                <div className="bg-transparent">
                    <Navbar transparent={true}/>
                </div>
            </header>
        </>
    )
}
export default Header
