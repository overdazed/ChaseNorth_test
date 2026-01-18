import { Link, useLocation } from "react-router-dom"
import HeartIcon from "../ui/HeartIcon"
import { getColorHex } from "@/utils/colorUtils";

// Helper function to check if product is new (added within last 14 days)
const isProductNew = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
};

const ProductGrid = ({ products, loading, error, isDay = true, newStarBadgeSize = 'md' }) => {
    // Theme classes
    const themeClasses = {
        card: isDay 
            ? 'border-[0.5px] border-black/10 hover:shadow-lg transition-all duration-300 bg-white' 
            : 'ring-[0.15px] ring-neutral-50/80 hover:ring-1 hover:ring-neutral-50 transition-all duration-300 bg-neutral-900',
        text: isDay ? 'text-neutral-950' : 'text-neutral-50',
        background: ''
    };
    const location = useLocation();
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>; // update also ProductDetails in Home.jsx
    }

    const handleProductClick = (e, productId) => {
        // Save scroll position with current path as key
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        sessionStorage.setItem(`scrollPos:${location.pathname}`, scrollY);
    };

    const CornerIcon = ({ className }) => (
        <>
            {/* Light mode icon (black) */}
            <img 
                src="/src/assets/ChaseNorth_x-black.svg"
                alt=""
                className={`${className} w-6 h-6 dark:hidden`}
            />
            {/* Dark mode icon (white) */}
            <img 
                src="/src/assets/ChaseNorth_x-white.svg"
                alt=""
                className={`${className} w-6 h-6 hidden dark:block`}
            />
        </>
    );



    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-[1600px] mx-auto px-4">
            {products.map((product, index) => (
                <div 
                    key={index} 
                    className={`relative w-full group ${themeClasses.card} ${themeClasses.background}`}
                >
                    {/* Corner Icons - First product: top-left, Last product: bottom-right */}
                    {index === 0 && (
                        <CornerIcon className="absolute -top-3 -left-3 z-20" />
                    )}
                    {index === products.length - 1 && (
                        <CornerIcon className="absolute -bottom-3 -right-3 z-20" />
                    )}
                    
                    <Link 
                        to={`/product/${product._id}`} 
                        onClick={(e) => handleProductClick(e, product._id)}
                        className="block w-full relative overflow-hidden"
                    >
                        {/* Aspect ratio container - 4:3 */}
                        <div className="relative w-full aspect-[4/5] overflow-hidden">
                            {/* New Product Badge */}
                            {isProductNew(product.createdAt) && (
                                <img 
                                    src="/new-star.svg" 
                                    alt="New Arrival" 
                                    className={`absolute -top-2 -left-2 z-10 ${
                                        newStarBadgeSize === 'sm' ? 'h-20 w-20 md:h-16 md:w-16' : 
                                        newStarBadgeSize === 'md' ? 'h-12 w-12 md:h-16 md:w-16' :
                                        'h-24 w-24 md:h-24 md:w-24'
                                    }`}
                                />
                            )}

                            {/* Color Indicators */}
                            {product.colors?.length > 0 && (
                                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10 flex space-x-0.5 sm:space-x-1 md:space-x-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 md:flex">
                                    {product.colors.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full"
                                            style={{
                                                backgroundColor: getColorHex(color),
                                                filter: 'saturate(1)',
                                                boxShadow: '0.25px 0.25px 0 0 rgba(255, 255, 255, 0.5)'
                                            }}
                                            title={color}
                                            aria-label={color}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {/* Product Image with Contained Zoom */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div
                                    style={{
                                        backgroundImage: `url(${product.images?.[0]?.url || 'https://via.placeholder.com/400'})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute"
                                    }}
                                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Product Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
                                {/* Brand Name - Hidden by default, shown on hover */}
                                <div className="absolute bottom-1 left-0 md:bottom-4 md:left-2 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-neutral-300 text-[10px] sm:text-xs md:text-base font-normal">
                                        {product.brand || 'Chase North'}
                                    </p>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-bold text-[10px] sm:text-xs md:text-base md:mt-1 -translate-y-5 md:translate-y-0 md:group-hover:-translate-y-8 transition-transform duration-300 truncate">
                                            <>
                                                <span className="max-[550px]:hidden">
                                                    {product.name}
                                                </span>
                                                <span className="hidden max-[550px]:inline truncate">
                                                    {product.name.length > 16 ? `${product.name.substring(0, 16)}...` : product.name}
                                                </span>
                                            </>
                                        </h3>
                                        <p className="text-white font-bold text-xs sm:text-sm md:text-base md:mt-1 -translate-y-5 md:translate-y-0 md:group-hover:-translate-y-8 transition-transform duration-300 whitespace-nowrap">
                                            {product.price} €
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Heart Icon */}
                    <div className="absolute top-2 right-0 md:top-2 md:right-2 z-10 w-8 h-8 md:w-6 md:h-6">
                        <HeartIcon
                            productId={product._id}
                            className="w-full h-full text-white"
                            containerClass="w-full h-full"
                        />
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}
export default ProductGrid

// include in ProductDetails.jsx

// make the top womans section, which uses the same product grid

// in Home.jsx