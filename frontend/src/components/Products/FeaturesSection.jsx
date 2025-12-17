import { useEffect, useState } from 'react';
import { HiShoppingBag } from "react-icons/hi"
import { HiArrowPathRoundedSquare } from "react-icons/hi2"
import { HiOutlineCreditCard } from "react-icons/hi"

const FeaturesSection = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        
        // Initial check
        checkDarkMode();
        
        // Listen for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        return () => observer.disconnect();
    }, []);
    
    return <section className={`pt-0 pb-16 px-4 ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
                <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <HiShoppingBag className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2 uppercase dark:text-white">
                    Free International Shipping
                </h4>
                <p className="dark:text-gray-300 text-gray-600 text-sm tracking-tighter">
                    On all orders over $100.00
                </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
                <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <HiArrowPathRoundedSquare className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2 uppercase dark:text-white">
                    45 days return
                </h4>
                <p className="dark:text-gray-300 text-gray-600 text-sm tracking-tighter">
                    Money back guarantee
                </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
                <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <HiOutlineCreditCard className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2 uppercase dark:text-white">
                    Secure checkout
                </h4>
                <p className="dark:text-gray-300 text-gray-600 text-sm tracking-tighter">
                    100% secured checkout process
                </p>
            </div>
        </div>
    </section>
}
export default FeaturesSection

// include in Home.jsx