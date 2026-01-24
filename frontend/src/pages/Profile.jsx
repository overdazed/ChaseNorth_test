import MyOrdersPage from "./MyOrdersPage"
import PersonalInfo from "../components/Profile/PersonalInfo"
import { FaSignOutAlt, FaUser, FaShoppingBag } from "react-icons/fa"
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
    const borderClass = isDarkMode ? 'border-neutral-700' : 'border-neutral-250'
    
    // State for active tab
    const [activeTab, setActiveTab] = useState('orders')
     
    // Tab configuration
    const tabs = [
        { id: 'orders', label: 'My Orders', icon: <FaShoppingBag className="mr-2" /> },
        { id: 'personal', label: 'Personal Information', icon: <FaUser className="mr-2" /> }
    ]

    return (
        <div className={`min-h-screen flex flex-col ${bgClass} ${textClass} transition-colors duration-500`}>
            <div className="flex-grow container mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    {/* Left Section*/}
                    <div className={`w-full md:w-1/3 lg:1/4 shadow-md border-r border-l rounded-lg p-6 ${bgClass} ${borderClass}`}>
                        <div className="flex items-center mb-4">
                            <img
                                src={user?.profilePicture || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <h1 className={`text-2xl md:text-3xl font-bold ${textClass}`}>
                                {user?.name}
                            </h1>
                        </div>
                        <p className="text-lg text-neutral-600 mb-4">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-full hover:bg-accent flex items-center justify-center gap-2">
                            <FaSignOutAlt/>
                            Logout
                        </button>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full mt-4 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                activeTab === 'personal' 
                                    ? 'bg-blue-600 text-white' 
                                    : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <FaUser />
                            Personal Information
                        </button>
                    </div>
                    
                    {/* Right Section: Content Area */}
                    <div className={`w-full md:w-2/3 lg:w-3/4 ${bgClass} ${borderClass} rounded-lg shadow-md border-r border-l overflow-hidden`}>
                        {/* Tab Navigation */}
                        <div className={`border-b ${borderClass} px-6`}>
                            <div className="flex space-x-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'orders' ? (
                                <MyOrdersPage />
                            ) : (
                                <PersonalInfo />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile

// add a route in App.jsx