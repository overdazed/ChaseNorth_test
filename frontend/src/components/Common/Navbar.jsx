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
            <div className={`w-full relative ${!transparent ? 'bg-white' : ''}`}>
                {/* Fade effect overlay */}
                {transparent && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/70 backdrop-blur-sm"></div>
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
                    <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-2 xl:space-x-3 pl-4" style={{ minWidth: '200px', justifyContent: 'flex-end' }}>


                        {/* Admin Button */}
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
                                className="bg-black px-3 py-1 rounded-full text-sm text-white hover:bg-gray-800 transition-colors"
                            >
                                Admin
                            </Link>
                        )}

                        {/* 1. Search Icon */}
                        {/* For Search functionality create a different component, we will come back to it later */}
                        {/* when you click the search icon, the search form opens up, where you can enter the query */}
                        {/* when you submit the request, it will take you to the collection page and display the matching results */}
                        {/* 1. when you click search icon, we want the form to open up */}
                        {/* 2. ensure that we want to capture the search term from the form */}
                        {/* make use of the State hook */}
                        {/* create file under Common folder -> SearchBar.jsx */}
                        <div className="overflow-auto ">
                            <SearchBar className="h-6 w-6 text-gray-700 hover:text-black"/>
                        </div>
                        {/* you now should be able to see SearchBar Txt on the screen */}

                        {/* 2. Account Icon - Shows login icon when not logged in, user icon when logged in */}
                        <Link to="/profile" className="">
                            {user ? (
                                // <HiOutlineUserCircle className="h-6 w-6 text-gray-700 hover:text-black"/>
                                <AiOutlineUser className="h-6 w-6 text-gray-700 hover:text-black"/>
                            ) : (
                                <HiArrowLeftEndOnRectangle className="h-6 w-6 text-gray-700 hover:text-black"/>
                            )}
                        </Link>

                        {/* Wishlist Icon */}
                        <div
                            className="relative group cursor-pointer"
                            style={{ padding: '0 0.3rem' }}
                        >
                            <div onClick={handleWishlistClick}>
                                <HeartIcon
                                    className="w-5 h-5 text-gray-700 group-hover:text-black"
                                    color="currentColor"
                                    hoverColor="#000000"
                                    noAnimation={true}
                                    wishlistCount={wishlistCount}
                                />
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCartDrawer}
                            className="relative"
                        >
                            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 hover:text-black"/>
                            {/* to display the count of items in the cart */}
                            {/* FIX: position on top of the cart -> -top-1*/}
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 bg-accent text-white text-xs rounded-full px-2 py-0.5">
                                {cartItemCount}
                            </span>
                            )}

                        </button>

                        {/* 3. Hamburger Menu Icon for smaller devices */}
                        {/* for the menu to work add onClick event handler*/}
                        <div className="flex items-center space-x-2">
                            <div className="hidden md:block">
                                <DarkModeToggle />
                            </div>
                            <div className="md:hidden">
                                <AnimatedHamburgerButton
                                    active={navDrawerOpen}
                                    onClick={toggleNavDrawer}
                                    className="text-gray-700 hover:text-black"
                                />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            {/* Cart Drawer */}
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
            {/* Mobile Navigation */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform 
                transition-transform duration-300 z-50 ${
                    navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Dark Mode Toggle for Mobile */}
                <div className="flex justify-end p-4">
                    <DarkModeToggle />
                </div>
                {/*    close button */}
                <div className="flex justify-end p-4">
                    {/* close button to work, onClick event handler*/}
                    {/*<button*/}
                    {/*    onClick={(e) => {*/}
                    {/*        e.stopPropagation();*/}
                    {/*        toggleNavDrawer();*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <IoMdClose className="h-6 w-6 text-gray-600"/>*/}
                    {/*</button>*/}
                </div>
                {/*    navigation links */}
                <div className="p-4">
                    {/*<h2 className="text-6xl font-semibold mb-12">*/}
                    {/*    Menu*/}
                    {/*</h2>*/}
                    {/* add spacing */}
                    <nav className="space-y-4">
                        <NavLink
                            to="/collections/all?gender=Men"
                            className="relative block text-gray-700 hover:text-black group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Men';
                                return (
                                    <span className={`relative inline-block text-xl md:text-base ${isActive ? 'text-black' : ''}`}>
                                        Men
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?gender=Women"
                            className="relative block text-gray-600 hover:text-black group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Women';
                                return (
                                    <span className={`relative inline-block text-xl md:text-base ${isActive ? 'text-black' : ''}`}>
                                        Women
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Top+Wear"
                            className="relative block text-gray-600 hover:text-black group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Top+Wear';
                                return (
                                    <span className={`relative inline-block text-xl md:text-base ${isActive ? 'text-black' : ''}`}>
                                        Top Wear
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Bottom+Wear"
                            className="relative block text-gray-600 hover:text-black group uppercase font-medium"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Bottom+Wear';
                                return (
                                    <span className={`relative inline-block text-xl md:text-base ${isActive ? 'text-black' : ''}`}>
                                        Bottom Wear
                                        <span className={`absolute left-0 -bottom-1 h-px bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default Navbar
