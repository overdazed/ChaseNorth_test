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
            theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
        }`}>
            {/* Mobile Toggle Button */}
            <div className={`flex md:hidden p-4 z-20 fixed w-full ${
                theme === 'dark' ? 'bg-neutral-800' : 'bg-white border-b'
            }`}>
                <button
                    onClick={toggleSidebar}
                    className={`${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}
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

            {/* Sidebar - Made sticky for desktop */}
            <div
                className={`w-64 min-h-screen fixed md:sticky top-0 left-0 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 md:translate-x-0 z-30 ${
                    theme === 'dark' ? 'bg-neutral-800' : 'bg-white'
                }`}
                style={{ height: '100vh' }}
            >
                <div className="h-full overflow-y-auto filter-scrollbar">
                    <AdminSidebar />
                </div>
            </div>

            {/* Main Content - Adjusted padding for mobile header */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16 md:pt-0 filter-scrollbar">
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
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