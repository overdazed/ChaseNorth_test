import Topbar from "../Layout/Topbar.jsx";
import Navbar from "./Navbar.jsx";
import { useLocation } from "react-router-dom";

const Header = () => {
    return (
        <>
            <Topbar />
            <Navbar transparent={true} />
        </>
    )
}
export default Header
