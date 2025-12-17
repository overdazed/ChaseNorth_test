import MyOrdersPage from "./MyOrdersPage"
import { FaSignOutAlt } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { logout } from "../redux/slices/authSlice.js"
import { clearCart } from "../redux/slices/cartSlice.js"

const Profile = () => {
    // Get user from authSlice
    const {user} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // If user is not logged in, redirect to /login
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // function to handle logout
    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/login");
    }

    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Check for saved theme preference on initial load
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true)
        }

        // Listen for theme changes from DarkModeToggle
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail.isDarkMode)
        }

        window.addEventListener('themeChange', handleThemeChange)
        return () => {
            window.removeEventListener('themeChange', handleThemeChange)
        }
    }, [])

    // Set background and text classes based on theme
    const bgClass = isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
    const textClass = isDarkMode ? 'text-white' : 'text-black'
    const borderClass = isDarkMode ? 'border-neutral-600' : 'border-neutral-250'

    return (
        <div className={`min-h-screen flex flex-col ${bgClass} ${textClass} transition-colors duration-500`}>
            <div className="flex-grow container mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    {/* Left Section*/}
                    <div className={`w-full md:w-1/3 lg:1/4 shadow-md rounded-lg p-6 bg-white`}>
                        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                            {user?.name}
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center justify-center gap-2">
                            <FaSignOutAlt/>
                            Logout
                        </button>
                    </div>
                    {/* Right Section: Orders Table */}
                    <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-lg shadow-md">
                        {/* Orders will be a component */}
                        <MyOrdersPage/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile

// add a route in App.jsx