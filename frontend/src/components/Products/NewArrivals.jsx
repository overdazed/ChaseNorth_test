import { motion, useTransform, useScroll, useAnimation } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import ChaseNorthBlack from "../../assets/ChaseNorth_x-black.svg";
import ChaseNorthWhite from "../../assets/ChaseNorth_x-white.svg";
import { getColorHex } from "@/utils/colorUtils.js";

const NewArrivals = () => {
    const [isNightMode, setIsNightMode] = useState(false);
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });
    const [newArrivals, setNewArrivals] = useState([]);

    // Sync with global theme
    useEffect(() => {
        const checkDarkMode = () => {
            setIsNightMode(document.documentElement.classList.contains('dark'));
        };

        // Initial check
        checkDarkMode();

        // Listen for theme changes
        const handleThemeChange = () => checkDarkMode();
        window.addEventListener('themeChange', handleThemeChange);

        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const sectionClass = isNightMode
        ? "pt-0 pb-0 px-4 lg:px-0 bg-neutral-950"
        : "pt-0 pb-0 px-4 lg:px-0 bg-neutral-50";

    const titleClass = "text-3xl font-bold text-center mb-4 text-neutral-50";

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals();
    }, []);

    return (
        <div className={`${isNightMode ? 'bg-neutral-950' : 'bg-neutral-50'} lg:-mt-28 -mt-20 transition-colors duration-300`}>
            <motion.section
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 4.0,
                            delay: 0.5,
                            ease: [0.16, 0.77, 0.47, 0.97]
                        }
                    }
                }}
            >
                <HorizontalScrollCarousel products={newArrivals} isNightMode={isNightMode} />
            </motion.section>
        </div>
    );
};

const HorizontalScrollCarousel = ({ products, isNightMode }) => {
    const targetRef = useRef(null);
    const containerRef = useRef(null);
    const location = useLocation();
    const [isRestoringScroll, setIsRestoringScroll] = useState(false);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end']
    });

    // Save scroll position when navigating away
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem('carouselScrollY', window.scrollY);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Restore scroll position when mounting
    useEffect(() => {
        const savedScrollY = sessionStorage.getItem('carouselScrollY');
        if (savedScrollY) {
            setIsRestoringScroll(true);
            window.scrollTo(0, parseInt(savedScrollY, 10));
            sessionStorage.removeItem('carouselScrollY');
            const timer = setTimeout(() => {
                setIsRestoringScroll(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    // Update scroll position in session storage when scrolling
    useEffect(() => {
        if (isRestoringScroll) return;

        const handleScroll = () => {
            sessionStorage.setItem('carouselScrollY', window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isRestoringScroll]);

    const [scrollRange, setScrollRange] = useState(0);
    const [sectionHeight, setSectionHeight] = useState("100vh");

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (container) {
            const updateDimensions = () => {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const totalWidth = container.scrollWidth;
                const scrollableWidth = totalWidth - viewportWidth + 32;
                setScrollRange(scrollableWidth);
                setSectionHeight(`${scrollableWidth + viewportHeight}px`);
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, [products]);

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [-window.innerWidth/2 + 20, -scrollRange - window.innerWidth/2 + 12]
    );

    return (
        <section ref={targetRef} className="mt-0 lg:h-[180vh] h-[120vh]">
            <div className="sticky top-20 lg:top-40 h-screen flex flex-col justify-center">
                <div className="mt-0 sm:mt-80 md:mt-80 lg:mt-48 xl:mt-28 absolute top-4 lg:top-10 w-full pt-4 lg:pt-8">
                    <div className="container mx-auto text-center px-4">
                        <h2 className={`text-2xl lg:text-3xl font-bold mb-2 mt-4 lg:mt-20 ${
                            isNightMode ? 'text-neutral-50' : 'text-neutral-950'
                        }`}>
                            Explore New Arrivals
                        </h2>
                        <p className={`text-sm lg:text-md max-w-2xl mx-auto px-2 ${
                            isNightMode ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                            Discover the latest styles straight off the runway, freshly added to
                            keep your wardrobe on the cutting edge of fashion.
                        </p>
                    </div>
                </div>
                <div className="relative h-[300vh] lg:h-[400vh] w-full flex items-center overflow-x-auto lg:overflow-visible">
                    <motion.div
                        ref={containerRef}
                        style={{
                            x: window.innerWidth < 768 ? 0 : x,
                            position: window.innerWidth < 768 ? 'relative' : 'absolute',
                            left: window.innerWidth < 768 ? '1rem' : '50%',
                            transform: window.innerWidth < 768 ? 'none' : 'translateX(-50%)',
                            paddingRight: window.innerWidth < 768 ? '2rem' : '0'
                        }}
                        className="flex items-center h-full"
                    >
                        <div className="flex gap-4 lg:gap-8 pl-4 pr-4 lg:pl-2 lg:pr-2">
                            {products.map((product, index) => (
                                <Card
                                    key={product._id}
                                    product={product}
                                    isFirst={index === 0}
                                    isLast={index === products.length - 1}
                                    isNightMode={isNightMode}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ColorSwatch = ({ color, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-6 h-6 opacity-80 rounded-full mx-0.5 transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1 ring-white' : ''} lg:opacity-0 lg:group-hover:opacity-80`}
        style={{ backgroundColor: color }}
        aria-label={`Color ${color}`}
    />
);

const Card = ({ product, isFirst, isLast, isNightMode }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        sessionStorage.setItem(`scrollPos:${window.location.pathname}`, scrollY);
        setTimeout(() => {
            window.location.href = `/product/${product._id}`;
        }, 0);
    };

    const CornerIcon = ({ className, isNightMode }) => (
        <img
            src={isNightMode ? ChaseNorthWhite : ChaseNorthBlack}
            alt=""
            className={`${className} w-6 h-6`}
            onError={(e) => {
                console.error('Failed to load image:', e.target.src);
                e.target.style.visibility = 'hidden';
            }}
        />
    );

    // Log the current viewport width for debugging
    useEffect(() => {
        const logViewportWidth = () => {
            const width = window.innerWidth;
            console.log(`Current viewport width: ${width}px`);
            if (width >= 420 && width <= 1024) {
                console.log('Viewport is in the 420-1024px range. Card dimensions should be adjusted.');
            }
        };

        logViewportWidth();
        window.addEventListener('resize', logViewportWidth);
        return () => window.removeEventListener('resize', logViewportWidth);
    }, []);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative 
        h-[320px] w-[240px]
        md:h-[450px] md:w-[350px]
        lg:h-[500px] lg:w-[400px]
        xl:h-[560px] lg:w-[448px]
        flex-shrink-0 ${
                isNightMode
                    ? 'ring-[0.5px] ring-neutral-50/80 bg-neutral-900'
                    : 'border-[0.5px] border-black/10 bg-white'
            } group`}
        >
            {isFirst && (
                <>
                    <CornerIcon className="absolute -top-3 -left-3 z-20" isNightMode={isNightMode} />
                    <CornerIcon className="absolute -bottom-3 -left-3 z-20" isNightMode={isNightMode} />
                </>
            )}
            {isLast && (
                <>
                    <CornerIcon className="absolute -top-3 -right-3 z-20" isNightMode={isNightMode} />
                    <CornerIcon className="absolute -bottom-3 -right-3 z-20" isNightMode={isNightMode} />
                </>
            )}

            <a
                href={`/product/${product._id}`}
                onClick={handleClick}
                className="block h-full w-full relative overflow-hidden"
            >
                <img
                    src="/new-star.svg"
                    alt="New Arrival"
                    className="absolute -top-2 -left-2 z-10 h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                />

                <div className="absolute inset-0 overflow-hidden">
                    <div
                        style={{
                            backgroundImage: `url(${product.images[0]?.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "100%"
                        }}
                        className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0) 50%)'
                        }}
                    >
                        <div className="absolute bottom-0 left-0 right-0 pt-10 lg:pt-16 pb-4 lg:pb-6 px-4 lg:px-6">
                            <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
                                {/* Brand Name - Hidden by default, shown on hover */}
                                <div className="absolute bottom-1 left-0 md:bottom-4 md:left-2 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-neutral-300 text-xs md:text-sm font-normal">
                                        {product.brand || 'Chase North'}
                                    </p>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-bold text-xs md:text-lg md:mt-1 -translate-y-5 md:translate-y-0 md:group-hover:-translate-y-8 transition-transform duration-300">
                                            <span className="max-[550px]:hidden">
                                                {product.name}
                                            </span>
                                            <span className="hidden max-[550px]:inline">
                                                {/*{product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name}*/}
                                                {product.name}
                                            </span>
                                        </h3>
                                        <p className="text-white font-bold text-sm md:text-lg md:mt-1 -translate-y-5 md:translate-y-0 md:group-hover:-translate-y-8 transition-transform duration-300">
                                            {product.price} €
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Color Indicators */}
                            {product.colors?.length > 0 && (
                                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10 flex space-x-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                    {product.colors.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 md:w-6 md:h-6 rounded-full"
                                            style={{ backgroundColor: getColorHex(color), filter: 'saturate(1)', boxShadow: '0.25px 0.25px 0 0 rgba(255, 255, 255, 0.5)' }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default NewArrivals;