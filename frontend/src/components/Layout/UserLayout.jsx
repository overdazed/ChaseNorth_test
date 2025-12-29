import Header from "../Common/Header";
import NewFooter from "../Common/NewFooter.jsx";
import ParallaxSection from "../Common/ParallaxSection";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../Common/Loader";
import Newsletter from "../Common/Newsletter.jsx";
//import Featured from '../Common/Featured.jsx';
import FeaturesSection from "@/components/Products/FeaturesSection.jsx";
import Breadcrumbs from "../Common/Breadcrumbs"; // Add this import

const useScrollToBottom = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            // Increased from 200 px to 500 px from bottom to make the button appear sooner
            const bottomPosition = document.documentElement.offsetHeight - 800;
            setIsAtBottom(scrollPosition >= bottomPosition);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isAtBottom;
};

const UserLayout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isRegisterPage = location.pathname === '/register';
    const isLoginPage = location.pathname === '/login';
    const isAtBottom = useScrollToBottom();

    const handleBugReportClick = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Set a timeout to ensure loading state is cleared
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 second timeout as a fallback

        navigate('/bug-report', {
            state: { from: window.location.href }
        }).then(() => {
            clearTimeout(timer);
            setIsLoading(false);
        }).catch(() => {
            clearTimeout(timer);
            setIsLoading(false);
        });
    };
    
    useEffect(() => {
        return () => {
            setIsLoading(false);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
        {/* Header */}
            <Header transparent={isHomePage}/>
        {/* Main Content */}
            {!isHomePage &&
                !isRegisterPage &&
                !isLoginPage &&
                !location.pathname.startsWith('/reset-password') &&
                !location.pathname.startsWith('/forgot-password') && (
                    <div className="w-full mt-14 md:mt-15 dark:md:mt-16">
                        <Breadcrumbs />
                    </div>

                )}


            <main className="flex-grow">
                <Outlet/>

            {/*/!* Featured Section *!/*/}
            {/*<Featured />*/}
                <Newsletter />

            {/* Features Section */}
                <FeaturesSection/>

            {/* Parallax Section */}
                <ParallaxSection />
            </main>
            {/*/!* Newsletter *!/*/}


        {/* Footer */}
            <NewFooter />
            {isLoading && (
                <div className="fixed inset-0 bg-neutral-900 z-50">
                    <Loader />
                </div>
            )}

            {/* Scroll-based Bug Report Button */}
            <div className={`fixed bottom-2 left-2 z-50 transition-opacity duration-500 ${isAtBottom ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    onClick={handleBugReportClick}
                    disabled={isLoading}
                    className={`group w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-full cursor-pointer transition-all duration-300 hover:bg-accent ${
                        isLoading ? 'opacity-50 cursor-wait' : ''
                    }`}
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 43 42"
                            className="w-4 h-4 transition-all duration-300 group-hover:[&>path]:stroke-white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path strokeWidth="4" stroke="#808080" d="M20 7H23C26.866 7 30 10.134 30 14V28.5C30 33.1944 26.1944 37 21.5 37C16.8056 37 13 33.1944 13 28.5V14C13 10.134 16.134 7 20 7Z" />
                            <path strokeWidth="4" stroke="#808080" d="M18 2V7" />
                            <path strokeWidth="4" stroke="#808080" d="M25 2V7" />
                            <path strokeWidth="4" stroke="#808080" d="M31 22H41" />
                            <path strokeWidth="4" stroke="#808080" d="M2 22H12" />
                            <path strokeWidth="4" stroke="#808080" d="M12.5785 15.2681C3.5016 15.2684 4.99951 12.0004 5 4" />
                            <path strokeWidth="4" stroke="#808080" d="M12.3834 29.3877C3.20782 29.3874 4.72202 32.4736 4.72252 40.0291" />
                            <path strokeWidth="4" stroke="#808080" d="M30.0003 14.8974C39.0545 15.553 37.7958 12.1852 38.3718 4.20521" />
                            <path strokeWidth="4" stroke="#808080" d="M29.9944 29.7379C39.147 29.1188 37.8746 32.2993 38.4568 39.8355" />
                        </svg>
                    )}
                    {!isLoading && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-accent text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
            Bug Report
            <span className="absolute right-full top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent transform rotate-45 -mr-0.5"></span>
        </span>
                    )}
                </button>
            </div>
        </div>
    )
}
export default UserLayout;
