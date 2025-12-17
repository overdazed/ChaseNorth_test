import { motion, useTransform, useScroll, useAnimation } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";

const NewArrivals = () => {
    const [isNightMode, setIsNightMode] = useState(false);
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });
    const [newArrivals, setNewArrivals] = useState([]);

    // In NewArrivals.jsx, update the time-based theme effect to respect manual changes
    useEffect(() => {
        const handleThemeChange = (e) => {
            setIsNightMode(e.detail.isDarkMode);
        };

        window.addEventListener('themeChange', handleThemeChange);

        // Only set initial theme if no manual theme is set
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            const hours = new Date().getHours();
            const isNight = hours >= 18 || hours < 6;
            setIsNightMode(isNight);
        }

        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    // Set initial theme based on time
    useEffect(() => {
        const hours = new Date().getHours();
        const isNight = hours >= 18 || hours < 6;
        setIsNightMode(isNight);
    }, []);

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    // useEffect(() => {
    //     const updateTheme = () => {
    //         const hours = new Date().getHours();
    //         // Night mode from 6 PM (18:00) to 6 AM (06:00)
    //         const isNight = hours >= 18 || hours < 6;
    //         console.log(`Current hour: ${hours}, isNightMode: ${isNight}`);
    //         setIsNightMode(isNight);
    //     };
    //
    //     // Set initial theme
    //     updateTheme();
    //
    //     // Update theme every minute to handle day/night transitions
    //     const intervalId = setInterval(updateTheme, 60000);
    //
    //     return () => clearInterval(intervalId);
    // }, []);

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
        <div className={`${isNightMode ? 'bg-neutral-950' : 'bg-neutral-50'} -mt-28 transition-colors duration-300`}>
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
                            duration: 4.0,  // Increased from 0.8 to 1.5 seconds
                            delay: 0.5,     // Added a small delay
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
            // Small delay to ensure the scroll position is applied
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

    const leftPadding = 32; // px, same as container gap-left
    const rightPadding = 32; // px, same as container gap-right


    useLayoutEffect(() => {
        const container = containerRef.current;
        if (container) {
            const updateDimensions = () => {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const totalWidth = container.scrollWidth;

                // Calculate the scrollable width (total width - viewport width + padding on both sides)
                const scrollableWidth = totalWidth - viewportWidth + 32; // Only add right padding (32px)

                // Set the section height to match the scrollable area plus viewport height
                setScrollRange(scrollableWidth);
                setSectionHeight(`${scrollableWidth + viewportHeight}px`);
            };

            // Initial calculation
            updateDimensions();

            // Update on window resize
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, [products]);

    // Adjust transform to start 16px from left edge
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [-window.innerWidth/2 + 20, -scrollRange - window.innerWidth/2 +12 ] // Start 16px from left, end 16px from right
    );

    return (
        <section ref={targetRef} style={{ height: '180vh' }} className="mt-0">
            <div className="sticky top-40 h-screen flex flex-col justify-center">
                <div className="absolute top-10 w-full pt-8">
                    <div className="container mx-auto text-center px-4">
                        <h2 className={`text-3xl font-bold mb-2 mt-20 ${isNightMode ? 'text-neutral-50' : 'text-neutral-950'}`}>
                            Explore New Arrivals
                        </h2>
                        <p className={`text-md max-w-2xl mx-auto ${isNightMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            Discover the latest styles straight off the runway, freshly added to
                            keep your wardrobe on the cutting edge of fashion.
                        </p>
                    </div>
                </div>
                <div className="relative h-[400vh] w-full flex items-center">
                    <motion.div
                        ref={containerRef}
                        style={{ x, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                        className="flex items-center"
                    >
                        <div className="flex gap-8 pl-2 pr-2">
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

const Card = ({ product, isFirst, isLast }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isNightMode = new Date().getHours() >= 18 || new Date().getHours() < 6;

    const handleClick = (e) => {
        // Prevent default to ensure we capture the scroll position
        e.preventDefault();

        // Save scroll position with current path as key
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        sessionStorage.setItem(`scrollPos:${window.location.pathname}`, scrollY);

        // Use a small timeout to ensure the scroll position is saved before navigation
        setTimeout(() => {
            window.location.href = `/product/${product._id}`;
        }, 0);
    };

    const CornerIcon = ({ className, isNightMode }) => {
        const iconSrc = isNightMode
            ? "/src/assets/ChaseNorth_x-white.svg"
            : "/src/assets/ChaseNorth_x-black.svg";

        return (
            <img
                src={iconSrc}
                alt=""
                className={`${className} w-6 h-6`}
            />
        );
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative h-[560px] w-[448px] ${isNightMode ? 'ring-[0.5px] ring-neutral-50/80 bg-neutral-900' : 'border-[0.5px] border-black/10 bg-white'} group`}
        >
            {/* Corner Icons - Show based on position */}
            {isFirst && (
                <>
                    <CornerIcon className="absolute -top-3 -left-3 z-20" />
                    <CornerIcon className="absolute -bottom-3 -left-3 z-20" />
                </>
            )}
            {isLast && (
                <>
                    <CornerIcon className="absolute -top-3 -right-3 z-20" />
                    <CornerIcon className="absolute -bottom-3 -right-3 z-20" />
                </>
            )}

            <a
                href={`/product/${product._id}`}
                onClick={handleClick}
                className="block h-full w-full relative overflow-hidden"
            >
                {/* New Product Badge */}
                <img
                    src="/new-star.svg"
                    alt="New Arrival"
                    className="absolute -top-2 -left-2 z-10 h-20 w-20"
                />

                {/* Product Image with Contained Zoom */}
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

                {/* Product Info Overlay with Middle Gradient */}
                <div className="absolute inset-0 flex flex-col justify-end">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0) 50%)'
                        }}
                    >
                        <div className="absolute bottom-0 left-0 right-0 pt-16 pb-6 px-6">
                            <h4 className="font-medium text-white">{product.name}</h4>
                            <p className="mt-1 text-white">${product.price}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default NewArrivals;
