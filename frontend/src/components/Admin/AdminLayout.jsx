import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa'
import AdminSidebar from "./AdminSidebar.jsx";
import { Outlet } from "react-router-dom";
import DarkModeToggle from '../ui/DarkModeToggle';

const AdminLayout = () => {
    const [theme, setTheme] = useState('light');

    // declare a state variable to determine if the sidebar is open or closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        // toggled the value of isSidebarOpen
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        // Listen for theme changes
        const handleThemeChange = (e) => {
            const newTheme = e.detail.isDarkMode ? 'dark' : 'light';
            setTheme(newTheme);
        };

        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative">
            {/* Mobile Toggle Button */}
            <div className="flex md:hidden p-4 bg-gray-900 text-white z-20 text-white">
                <button onClick={toggleSidebar} >
                    <FaBars size={24}/>
                </button>
                <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
            </div>

            {/* Overlay for the mobile sidebar */}
            {/* check if Sidebar is open */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
            >
                {/* Sidebar */}
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6 overflow-auto">
                {/* This is where all the Layout for Admin will be rendered */}
                <Outlet />
            </div>
        </div>
    )
}
export default AdminLayout

// add the route in App.jsx
// create an Admin in the Navbar