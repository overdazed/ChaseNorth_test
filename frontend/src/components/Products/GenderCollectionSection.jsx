// include in Home.jsx
import { useState, useEffect } from 'react';
import mensCollectionImage from "../../assets/mens-collection.webp"
import womensCollectionImage from "../../assets/womens-collection.webp"
import { Link } from "react-router-dom"

const GenderCollectionSection = () => {
    const [isNightMode, setIsNightMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsNightMode(isDark);
        };

        handleThemeChange();
        window.addEventListener('themeChange', handleThemeChange);

        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);
    
    const sectionClass = isNightMode 
        ? "py-16 px-4 lg:px-0 bg-neutral-950" 
        : "py-16 px-4 lg:px-0 bg-neutral-50";
        
    const cardClass = isNightMode 
        ? "absolute bottom-8 left-8 bg-neutral-900 bg-opacity-90 p-4" 
        : "absolute bottom-8 left-8 bg-white bg-opacity-90 p-4";
        
    const headingClass = isNightMode 
        ? "text-2xl font-bold text-white mb-3" 
        : "text-2xl font-bold text-gray-900 mb-3";
        
    const linkClass = isNightMode 
        ? "text-white underline hover:text-gray-300" 
        : "text-gray-950 underline hover:text-gray-700";
    return (
        <section className={sectionClass}>
            <div className="container mx-auto flex flex-col md:flex-row gap-8">
                {/* Womens Collection */}
                <div className="relative flex-1 ">
                    <img
                        src={womensCollectionImage}
                        alt="Women's Collection"
                        className="w-full h-[700px] object-cover"
                    />
                    <div className={cardClass}>
                        <h2 className={headingClass}>
                            Women's Collection
                        </h2>
                        <Link
                            to="/collections/all?gender=Women"
                            className={linkClass}>
                            Shop Now
                        </Link>
                    </div>
                </div>
                {/* Mens Collection */}
                <div className="relative flex-1 ">
                    <img
                        src={mensCollectionImage}
                        alt="Men's Collection"
                        className="w-full h-[700px] object-cover"
                    />
                    <div className={cardClass}>
                        <h2 className={headingClass}>
                            Men's Collection
                        </h2>
                        <Link
                            to="/collections/all?gender=Men"
                            className={linkClass}>
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default GenderCollectionSection
