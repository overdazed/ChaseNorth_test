import { Link, NavLink } from "react-router-dom";
// HiOutlineShoppingBag = Cart
// HiBars3BottomRight = Mobile Navbar Drawer
import {
    HiOutlineUserCircle,
    HiOutlineShoppingBag,
    HiBars3BottomRight,
    HiArrowLeftEndOnRectangle
} from "react-icons/hi2";

import { AiOutlineUser } from "react-icons/ai";

import ChaseNorthLogo from "../../assets/ChaseNorth.svg";
import SearchBar from "./SearchBar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { isAction } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DarkModeToggle from "../ui/DarkModeToggle";
import HeartIcon from "../ui/HeartIcon";

const VARIANTS = {
    top: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            top: ["25%", "50%", "50%"],
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            top: ["50%", "50%", "25%"],
        },
    },
    middle: {
        open: {
            rotate: ["0deg", "0deg", "-45deg"],
        },
        closed: {
            rotate: ["-45deg", "0deg", "0deg"],
        },
    },
    bottom: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            bottom: ["25%", "50%", "50%"],
            left: "50%",
            width: "1.5rem",
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            bottom: ["50%", "50%", "25%"],
            left: "calc(50% + 6px)",
            width: "0.75rem",
        },
    },
};

const AnimatedHamburgerButton = ({ active, onClick, className = '' }) => (
    <MotionConfig
        transition={{
            duration: 0.5,
            ease: "easeInOut",
        }}
    >
        <motion.button
            initial={false}
            animate={active ? "open" : "closed"}
            onClick={onClick}
            className={`relative h-6 w-6 focus:outline-none ${className}`}
            aria-label="Toggle menu"
        >
            <motion.span
                variants={VARIANTS.top}
                className="absolute h-0.5 w-6 bg-current"
                style={{ y: "-50%", left: "50%", x: "-50%", top: "25%" }}
            />
            <motion.span
                variants={VARIANTS.middle}
                className="absolute h-0.5 w-6 bg-current"
                style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
            />
            <motion.span
                variants={VARIANTS.bottom}
                className="absolute h-0.5 w-3 bg-current"
                style={{
                    x: "-50%",
                    y: "50%",
                    bottom: "25%",
                    left: "50%"
                }}
            />
        </motion.button>
    </MotionConfig>
);

const Navbar = ({ transparent = false }) => {

    // to open and  const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Load wishlist count from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateWishlistCount = () => {
                const saved = localStorage.getItem('wishlist');
                const wishlist = saved ? JSON.parse(saved) : [];
                setWishlistCount(wishlist.length);
            };

            // Initial load
            updateWishlistCount();

            // Listen for storage events to update wishlist count when changed in other tabs
            const handleStorageChange = (e) => {
                if (e.key === 'wishlist') {
                    updateWishlistCount();
                }
            };

            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    // Update SHOPPING BAG Count
    // Get cart from the cartSlice
    const {cart} = useSelector((state) => state.cart);

    // Pass wishlist count to HeartIcon
    <HeartIcon count={wishlistCount} />
    const { user } = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce(
        (total, product) => total + product.quantity,
        0
        // if products are not present, value will be 0
    ) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    }

    // to toggle the value of drawerOpen
    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    const navigate = useNavigate();

    const handleWishlistClick = () => {
        navigate('/wishlist');
    }

    const mobileMenuRef = useRef(null);

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setNavDrawerOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if:
            // 1. The menu is open
            // 2. The click is outside the mobile menu
            // 3. The click is not on the burger button
            const isBurgerButton = event.target.closest('button[aria-label="Toggle menu"]') !== null;

            if (navDrawerOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !isBurgerButton
            ) {
                setNavDrawerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navDrawerOpen]);

    return (
        <>
            {/* Full width background with fade effect */}
            <div className={`w-full relative ${!transparent ? 'bg-neutral-50' : ''}`}>
                {/* Fade effect overlay */}
                {transparent && (
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/70 to-neutral-50/70 backdrop-blur-sm"></div>
                )}
                <nav className="container mx-auto flex items-center justify-between py-3 px-4 relative z-10">
                    {/*<nav className="w-full px-20 md:px-36 lg:px-40 flex items-center justify-between py-4 relative z-10">*/}


                    {/* Left - Logo */}
                    <div>
                        {/*we need Link component from react-router-dom*/}
                        <Link
                            to="/"
                            className="h-8 w-auto flex items-center"
                            onClick={(e) => {
                                // Only scroll to top if we're already on the home page
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        >
                            <img
                                src={ChaseNorthLogo}
                                alt="ChaseNorth Logo"
                                className="h-12 w-auto"
                            />
                        </Link>
                    </div>
                    {/* Center - Navigation Links */}
                    {/* for smaller devices, we'll have a different layout */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-4 lg:space-x-8 px-4">
                            <NavLink
                                to="/collections/all?gender=Men"
                                className="relative text-gray-700 hover:text-black text-sm font-medium uppercase group pb-1"
                            >
                                {() => {
                                    const isActive = window.location.search === '?gender=Men';
                                    return (
                                        <span className={`relative ${isActive ? 'text-black' : ''}`}>
                                        Men
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                    );
                                }}
                            </NavLink>

                            <NavLink
                                to="/collections/all?gender=Women"
                                className="relative text-gray-700 hover:text-black text-sm font-medium uppercase group pb-1"
                            >
                                {() => {
                                    const isActive = window.location.search === '?gender=Women';
                                    return (
                                        <span className={`relative ${isActive ? 'text-black' : ''}`}>
                                        Women
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                    );
                                }}
                            </NavLink>

                            <NavLink
                                to="/collections/all?category=Top+Wear"
                                className="relative text-gray-700 hover:text-black text-sm font-medium uppercase group pb-1"
                            >
                                {() => {
                                    const isActive = window.location.search === '?category=Top+Wear';
                                    return (
                                        <span className={`relative ${isActive ? 'text-black' : ''}`}>
                                        Top Wear
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                    );
                                }}
                            </NavLink>

                            <NavLink
                                to="/collections/all?category=Bottom+Wear"
                                className="relative text-gray-700 hover:text-black text-sm font-medium uppercase group pb-1"
                            >
                                {() => {
                                    const isActive = window.location.search === '?category=Bottom+Wear';
                                    return (
                                        <span className={`relative ${isActive ? 'text-black' : ''}`}>
                                        Bottom Wear
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                    );
                                }}
                            </NavLink>
                        </div>
                    </div>
                    {/* work on right sections for the icons */}
                    {/* Right - Icons */}
                    <div className="flex items-center space-x-4 lg:space-x-2 pl-4" style={{ minWidth: 'auto', justifyContent: 'flex-end' }}>
                        {/* Search Bar - Always visible on mobile */}
                        <div className="overflow-auto">
                            <SearchBar className="h-6 w-6 text-gray-700 hover:text-black"/>
                        </div>

                        {/* Hamburger Menu Icon for mobile */}
                        <div className="md:hidden">
                            <AnimatedHamburgerButton
                                active={navDrawerOpen}
                                onClick={toggleNavDrawer}
                                className="text-gray-700 hover:text-black"
                            />
                        </div>

                        {/* Desktop Icons - Hidden on mobile */}
                        <div className="hidden md:flex items-center space-x-2">
                            {/* Admin Button - Only visible for admin users */}
                            {user && user.role === "admin" && (
                                <Link
                                    to="/admin"
                                    onClick={(e) => {
                                        if (window.location.pathname === '/admin') {
                                            e.preventDefault();
                                            window.location.href = '/admin';
                                        }
                                    }}
                                    className="bg-black px-3 py-1 rounded-full text-sm text-neutral-50 hover:bg-gray-800 transition-colors"
                                >
                                    Admin
                                </Link>
                            )}

                            <Link to="/profile" className="">
                                {user ? (
                                    <AiOutlineUser className="h-6 w-6 text-gray-700 hover:text-black"/>
                                ) : (
                                    <HiArrowLeftEndOnRectangle className="h-6 w-6 text-gray-700 hover:text-black"/>
                                )}
                            </Link>

                            <div className="relative group cursor-pointer" style={{ padding: '0 0.3rem' }}>
                                <div onClick={handleWishlistClick} className="relative">
                                    <HeartIcon
                                        className="w-5 h-5 text-gray-700 group-hover:text-black"
                                        color="currentColor"
                                        hoverColor="#000000"
                                        noAnimation={true}
                                    />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button onClick={toggleCartDrawer} className="relative">
                                <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 hover:text-black"/>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            <DarkModeToggle />
                        </div>
                    </div>

                </nav>
            </div>
            {/* Cart Drawer */}
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
            {/* Mobile Navigation */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 w-full h-full bg-neutral-50 dark:bg-neutral-950 shadow-lg transform 
                transition-transform duration-300 z-50 ${
                    navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header with Dark Mode Toggle and Close Button */}
                <div className="flex justify-between items-center pt-3 pl-6 pr-12">
                    <div className="flex items-center">
                        <DarkModeToggle />
                    </div>
                    <AnimatedHamburgerButton
                        active={navDrawerOpen}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleNavDrawer();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    />
                </div>
                {/* Navigation links container */}
                <div className="h-[calc(100%-4rem)] flex flex-col justify-between p-4">
                    <nav className="space-y-12">
                        <NavLink
                            to="/collections/all?gender=Men"
                            className="relative block text-center text-gray-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Men';
                                return (
                                    <span className={`relative inline-block text-4xl font-medium ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-50'}`}>
                                        Men
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?gender=Women"
                            className="relative block text-center text-gray-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Women';
                                return (
                                    <span className={`relative inline-block text-4xl font-medium ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-50'}`}>
                                        Women
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Top+Wear"
                            className="relative block text-center text-gray-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Top+Wear';
                                return (
                                    <span className={`relative inline-block text-4xl font-medium ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-50'}`}>
                                        Top Wear
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Bottom+Wear"
                            className="relative block text-center text-gray-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Bottom+Wear';
                                return (
                                    <span className={`relative inline-block text-4xl font-medium ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-50'}`}>
                                        Bottom Wear
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>
                    </nav>
                </div>
                
                {/* Mobile Bottom Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-50 dark:bg-neutral-900 bg-neutral-200 py-4 px-6">
                    <div className="space-y-3">
                        {/* Account */}
                        <Link 
                            to="/profile" 
                            className="flex items-center text-gray-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            onClick={toggleNavDrawer}
                        >
                            <div className="relative w-6 flex-shrink-0">
                                {user ? (
                                    <AiOutlineUser className="h-6 w-6"/>
                                ) : (
                                    <HiArrowLeftEndOnRectangle className="h-6 w-6"/>
                                )}
                            </div>
                            <span className="text-sm font-medium ml-6">Account</span>
                        </Link>

                        {/* Wishlist */}
                        <div 
                            className="flex items-center text-gray-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNavDrawer();
                                handleWishlistClick();
                            }}
                        >
                            <div className="relative w-6 flex-shrink-0">
                                <HeartIcon
                                    className="w-6 h-6"
                                    color="currentColor"
                                    hoverColor="#000000"
                                    noAnimation={true}
                                />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium ml-6">Wishlist</span>
                        </div>

                        {/* Cart */}
                        <div 
                            className="flex items-center text-gray-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNavDrawer();
                                toggleCartDrawer();
                            }}
                        >
                            <div className="relative w-6 flex-shrink-0">
                                <HiOutlineShoppingBag className="h-6 w-6"/>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium ml-6">Cart</span>
                        </div>
                    </div>
                </div>
                {/* Social Media Links */}
                <div className="mt-auto pt-6 pb-8 border-t border-gray-200 dark:border-neutral-800">
                    <p className="text-center text-gray-500 dark:text-neutral-400 text-sm mb-4">FOLLOW US</p>
                    <div className="flex justify-center space-x-6">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-300">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-300">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-300">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar
