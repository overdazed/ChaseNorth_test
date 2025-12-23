import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from "./AdminSidebar.jsx";
import { Outlet } from "react-router-dom";
import DarkModeToggle from '../ui/DarkModeToggle';

const AdminLayout = () => {
    const [theme, setTheme] = useState('light');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        // Get the current theme from localStorage or use system preference
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        // Listen for theme changes from other components
        const handleThemeChange = (e) => {
            const newTheme = e.detail?.isDarkMode ? 'dark' : 'light';
            setTheme(newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        };

        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col md:flex-row relative transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
            {/* Mobile Toggle Button */}
            <div className={`flex md:hidden p-4 z-20 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white border-b'
            }`}>
                <button
                    onClick={toggleSidebar}
                    className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                    <FaBars size={24} />
                </button>
                <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
                <div className="ml-auto">
                    <DarkModeToggle />
                </div>
            </div>

            {/* Overlay for the mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`w-64 min-h-screen absolute md:relative transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 md:translate-x-0 md:static md:block z-30`}
            >
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <DarkModeToggle />
                    </div>
                    <Outlet context={{ theme }} />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;