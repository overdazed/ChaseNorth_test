import MyOrdersPage from "./MyOrdersPage"
import PersonalInfo from "../components/Profile/PersonalInfo"
import SupportAndHelp from "../components/Profile/SupportAndHelp"
import UserReports from "../components/Profile/UserReports"
import { FaSignOutAlt, FaUser, FaShoppingBag, FaQuestionCircle, FaFileAlt, FaUndo } from "react-icons/fa"
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { logout } from "../redux/slices/authSlice.js"
import { clearCart } from "../redux/slices/cartSlice.js"

const Profile = () => {
    // Get user from authSlice
    const {user} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
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
    const [activeTab, setActiveTab] = useState('personal')
     
    // Tab configuration - Personal Information first
    const tabs = [
        { id: 'personal', label: 'Personal Information', icon: <FaUser className="mr-2" /> },
        { id: 'orders', label: 'My Orders', icon: <FaShoppingBag className="mr-2" /> },
        { id: 'reports', label: 'Your Reports', icon: <FaFileAlt className="mr-2" /> },
        { id: 'support', label: 'Support & Help', icon: <FaQuestionCircle className="mr-2" /> },
        { id: 'returns', label: 'Return Center', icon: <FaUndo className="mr-2" /> }
    ]

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    return (
        <div className={`min-h-screen flex flex-col ${bgClass} ${textClass} transition-colors duration-500`}>
            <div className="flex-grow container mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 h-full">
                    {/* Left Section*/}
                    <div className={`w-full md:w-1/3 lg:1/4 shadow-md border-r border-l rounded-lg p-6 ${bgClass} ${borderClass} flex flex-col h-[calc(100vh-8rem)]`}>
                        <div className="flex-1 overflow-y-auto">
                        <div className="flex items-center mb-4">
                            {user?.profilePicture ? (
                                <img
                                    src={user?.profilePicture}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full mr-4 flex items-center justify-center bg-transparent">
                                    <AiOutlineUser className="text-4xl text-neutral-700 dark:text-neutral-300" />
                                </div>
                            )}
                            <h1 className={`text-2xl md:text-3xl font-bold ${textClass}`}>
                                {user?.name}
                            </h1>
                        </div>
                        <p className="text-lg text-neutral-600 mb-4">{user?.email}</p>
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full mt-12 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                    activeTab === 'personal'
                                        ? 'bg-indigo-600 text-white'
                                        : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <FaUser />
                                Personal Information
                            </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full mt-2 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                activeTab === 'orders'
                                    ? 'bg-indigo-600 text-white'
                                    : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <FaShoppingBag />
                            My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`w-full mt-2 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                activeTab === 'reports'
                                    ? 'bg-indigo-600 text-white'
                                    : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <FaFileAlt />
                            Your Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('support')}
                            className={`w-full mt-2 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                activeTab === 'support'
                                    ? 'bg-indigo-600 text-white'
                                    : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <FaQuestionCircle />
                            <span>Support & Help</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('returns')}
                            className={`w-full mt-2 py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                                activeTab === 'returns'
                                    ? 'bg-indigo-600 text-white'
                                    : isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <FaUndo />
                            <span>Return Center</span>
                        </button>
                    </div>
                    <div className="sticky bottom-0 left-0 right-0 bg-inherit pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-full hover:bg-accent flex items-center justify-center gap-2">
                            <FaSignOutAlt/>
                            Logout
                        </button>
                    </div>
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
                                                ? 'border-indigo-500 text-indigo-600'
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
                           ) : activeTab === 'personal' ? (
                               <PersonalInfo />
                           ) : activeTab === 'reports' ? (
                               <UserReports />
                           ) : activeTab === 'support' ? (
                            <SupportAndHelp 
                                showOnlyFaq={false} 
                                onTabChange={(tab) => setActiveTab(tab)} 
                            />
                        ) : (
                            <div className="bg-transparent rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                    Return Center
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                            How to Initiate a Return
                                        </h3>
                                        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                            <li>Log in to your account</li>
                                            <li>Go to "My Orders"</li>
                                            <li>Find the order with the item you want to return</li>
                                            <li>Click "Request Return"</li>
                                            <li>Follow the on-screen instructions</li>
                                        </ol>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h3 className="font-semibold text-lg mb-3 text-neutral-800 dark:text-neutral-50">
                                            Return Policy
                                        </h3>
                                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                            <li>✅ 30-day return policy for most items</li>
                                            <li>❌ Final sale items cannot be returned</li>
                                            <li>📦 Items must be in original condition with tags attached</li>
                                            <li>🔄 Refunds will be processed within 5-7 business days</li>
                                            <li>🚚 Return shipping is free for all EU orders</li>
                                        </ul>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                            Need Help with Your Return?
                                        </h3>
                                        <p className="text-yellow-700 dark:text-yellow-300">
                                            If you're having trouble with your return or have questions about our return policy, 
                                            please contact our <button 
                                                onClick={() => setActiveTab('support')}
                                                className="text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                support team
                                            </button>.
                                        </p>
                                    </div>
                                </div>
                            </div>
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