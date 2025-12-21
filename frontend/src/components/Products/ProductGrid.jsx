import { Link, useLocation } from "react-router-dom"
import HeartIcon from "../ui/HeartIcon"

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
                                        newStarBadgeSize === 'md' ? 'h-16 w-16 md:h-16 md:w-16' :
                                        'h-24 w-24 md:h-24 md:w-24'
                                    }`}
                                />
                            )}

                            {/* Color Indicators */}
                            {product.colors?.length > 0 && (
                                <div className="absolute bottom-4 right-4 z-10 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {product.colors.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-full border border-neutral-400 shadow-sm"
                                            style={{ backgroundColor: color }}
                                            title={color}
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
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-white font-medium text-sm">
                                            {product.name}
                                        </h3>
                                        <p className="text-white font-bold text-lg">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    
                    {/* Heart Icon */}
                    <div className="absolute top-2 right-2 z-10 w-8 h-8 md:w-6 md:h-6">
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