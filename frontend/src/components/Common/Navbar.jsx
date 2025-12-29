import { Link, NavLink } from "react-router-dom";
// HiOutlineShoppingBag = Cart
// HiBars3BottomRight = Mobile Navbar Drawer
import {TbBrandMeta, TbMail} from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import {
    HiOutlineUserCircle,
    HiOutlineShoppingBag,
    HiBars3BottomRight,
    HiArrowLeftEndOnRectangle
} from "react-icons/hi2";

import { AiOutlineUser } from "react-icons/ai";

import ChaseNorthLogo from "../../assets/ChaseNorth.svg";
import ChaseNorthLogoMobileWhite from "../../assets/ChaseNorth-white.svg";
import ChaseNorthLogoMobileBlack from "../../assets/ChaseNorth-black.svg";
import SearchBar from "./SearchBar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import React, { useState, useRef, useEffect } from "react";
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

const AnimatedHamburgerButton = ({ active, onClick, className = '' }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isAnimating) {
            setIsAnimating(true);
            onClick(e);
            // Reset animation state after animation completes
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    return (
        <MotionConfig
            transition={{
                duration: 0.5,
                ease: "easeInOut",
            }}
        >
            <motion.button
                initial={false}
                animate={active ? "open" : "closed"}
                onClick={handleClick}
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
};
const Navbar = ({ transparent = false }) => {

    // to open and const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { wishlistCount } = useSelector((state) => state.products);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [language, setLanguage] = useState('German / Deutsch');
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    // Wishlist count is now managed by Redux

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

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isScrollingDown = currentScrollPos > prevScrollPos && currentScrollPos > 10;

            if (isScrollingDown) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    return (
        <>
            {/* Full width background with fade effect - Sticky on mobile */}
            {/*<div className={`w-full ${transparent ? 'bg-transparent' : 'bg-white dark:bg-neutral-900'} transition-colors duration-300 fixed top-0 left-0 right-0 z-50`}>*/}
            <div className={`w-full transition-all duration-300 fixed top-0 md:fixed ${
                isScrolled ? 'md:top-0' : 'md:top-7'
            } z-40 ${
                transparent ? 'bg-transparent' : 'bg-white dark:bg-neutral-900 shadow-sm'
            }`}>
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
                                className="relative text-neutral-700 hover:text-black text-sm font-medium uppercase group pb-1"
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
                                className="relative text-neutral-700 hover:text-black text-sm font-medium uppercase group pb-1"
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
                                className="relative text-neutral-700 hover:text-black text-sm font-medium uppercase group pb-1"
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
                                className="relative text-neutral-700 hover:text-black text-sm font-medium uppercase group pb-1"
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
                            <SearchBar className="h-6 w-6 text-neutral-700 hover:text-black"/>
                        </div>

                        {/* Hamburger Menu Icon for mobile */}
                        <div className="md:hidden">
                            <AnimatedHamburgerButton
                                active={navDrawerOpen}
                                onClick={toggleNavDrawer}
                                className="text-neutral-700 hover:text-black"
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
                                    className="bg-black px-3 py-1 rounded-full text-sm text-neutral-50 hover:bg-neutral-800 transition-colors"
                                >
                                    Admin
                                </Link>
                            )}

                            <Link to="/profile" className="">
                                {user ? (
                                    <AiOutlineUser className="h-6 w-6 text-neutral-700 hover:text-black"/>
                                ) : (
                                    <HiArrowLeftEndOnRectangle className="h-6 w-6 text-neutral-700 hover:text-black"/>
                                )}
                            </Link>

                            <div className="relative group cursor-pointer" style={{ padding: '0 0.3rem' }}>
                                <div onClick={handleWishlistClick} className="relative">
                                    <HeartIcon
                                        className="w-5 h-5 text-neutral-700 group-hover:text-black"
                                        color="currentColor"
                                        hoverColor="#000000"
                                        noAnimation={true}
                                    />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button onClick={toggleCartDrawer} className="relative">
                                <HiOutlineShoppingBag className="h-6 w-6 text-neutral-700 hover:text-black"/>
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
                {/* Header with Logo and Navigation */}
                <div className="relative flex items-center justify-between pt-3 pb-2 pr-4">
                    {/* Dark Mode Toggle */}
                    <div className="z-10 -ml-3 pl-2">
                        <DarkModeToggle />
                    </div>

                    {/* Centered Logo */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 opacity-75">
                        <Link to="/" onClick={toggleNavDrawer}>
                            <img
                                src={ChaseNorthLogoMobileBlack}
                                alt="ChaseNorth Logo"
                                className="h-8 w-auto dark:hidden"
                            />
                            <img
                                src={ChaseNorthLogoMobileWhite}
                                alt="ChaseNorth Logo"
                                className="h-8 w-auto hidden dark:block"
                            />
                        </Link>
                    </div>

                    {/* Close Button */}
                    <div className="z-10">
                        <AnimatedHamburgerButton
                            active={navDrawerOpen}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNavDrawer();
                            }}
                            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        />
                    </div>
                </div>
                {/* Navigation links container */}
                <div className="h-[calc(100vh-12rem)] flex flex-col justify-start pt-20 p-4 overflow-y-auto">
                    <nav className="space-y-12">
                        <NavLink
                            to="/collections/all?gender=Men"
                            className="relative block text-center text-neutral-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-normal"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Men';
                                return (
                                    <span className={`relative inline-block text-3xl font-normal ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-400'}`}>
                                        Men
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?gender=Women"
                            className="relative block text-center text-neutral-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-normal"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?gender=Women';
                                return (
                                    <span className={`relative inline-block text-3xl font-normal ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-400'}`}>
                                        Women
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Top+Wear"
                            className="relative block text-center text-neutral-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-normal"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Top+Wear';
                                return (
                                    <span className={`relative inline-block text-3xl font-normal ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-400'}`}>
                                        Top Wear
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>

                        <NavLink
                            to="/collections/all?category=Bottom+Wear"
                            className="relative block text-center text-neutral-700 dark:text-neutral-50 hover:text-black dark:hover:text-neutral-50 group uppercase font-normal"
                            onClick={toggleNavDrawer}
                        >
                            {() => {
                                const isActive = window.location.search === '?category=Bottom+Wear';
                                return (
                                    <span className={`relative inline-block text-3xl font-normal ${isActive ? 'text-black dark:text-neutral-50' : 'dark:text-neutral-400'}`}>
                                        Bottom Wear
                                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-black dark:bg-neutral-50 transition-all duration-300 transform scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                                    </span>
                                );
                            }}
                        </NavLink>
                    </nav>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 dark:bg-neutral-900 bg-neutral-200 py-4 px-6">
                    <div className="space-y-3">
                        {/* Admin Button - Only visible for admin users in mobile menu */}
                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className={`flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                                    window.location.pathname === '/admin'
                                        ? 'text-black dark:text-neutral-50'
                                        : 'text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50'
                                }`}
                                onClick={toggleNavDrawer}
                            >
                                <div className="relative w-6 flex-shrink-0">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <span className={`text-sm font-normal ml-6 ${
                                    window.location.pathname === '/admin' ? 'border-b border-black dark:border-white' : ''
                                }`}>
                                    Admin Dashboard
                                </span>
                            </Link>
                        )}

                        {/* Account */}
                        <Link
                            to="/profile"
                            className={`flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                                window.location.pathname === '/profile'
                                    ? 'text-black dark:text-neutral-50'
                                    : 'text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50'
                            }`}
                            onClick={toggleNavDrawer}
                        >
                            <div className="relative w-6 flex-shrink-0">
                                {user ? (
                                    <AiOutlineUser className="h-6 w-6"/>
                                ) : (
                                    <HiArrowLeftEndOnRectangle className="h-6 w-6"/>
                                )}
                            </div>
                            <span className={`text-sm font-normal ml-6 ${
                                window.location.pathname === '/profile' ? 'border-b border-black dark:border-white' : ''
                            }`}>
                                Account
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <div
                            className={`flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer ${
                                window.location.pathname === '/wishlist'
                                    ? 'text-black dark:text-neutral-50'
                                    : 'text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNavDrawer();
                                handleWishlistClick();
                            }}
                        >
                            <div className="relative w-6 flex-shrink-0">
                                <HeartIcon
                                    className="w-6 h-6"
                                    color={window.location.pathname === '/wishlist' ? (document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000') : 'currentColor'}
                                    hoverColor="#000000"
                                    noAnimation={true}
                                />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-neutral-50 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-sm font-normal ml-6 ${
                                window.location.pathname === '/wishlist' ? 'border-b border-black dark:border-white' : ''
                            }`}>
                                Wishlist
                            </span>
                        </div>

                        {/* Cart */}
                        <div
                            className="flex items-center text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-50 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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
                            <span className="text-sm font-normal ml-6">Cart</span>
                        </div>

                        <div className="h-2 md:hidden"></div>

                        {/* Language Selector */}
                        <div className="mt-auto pt-3 border-t border-neutral-400 dark:border-neutral-800">
                            <div className="relative">
                                <button
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-normal text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsLanguageOpen(!isLanguageOpen);
                                    }}
                                    onMouseEnter={() => setIsLanguageOpen(true)}
                                    onMouseLeave={() => setIsLanguageOpen(false)}
                                    aria-haspopup="true"
                                    aria-expanded={isLanguageOpen}
                                >
                                    <span>{language}</span>
                                    <svg className={`h-4 w-4 text-neutral-500 transition-transform ${isLanguageOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className={`absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden z-10 transition-all duration-200 ${isLanguageOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                    onMouseEnter={() => setIsLanguageOpen(true)}
                                    onMouseLeave={() => setIsLanguageOpen(false)}
                                >
                                    <button
                                        className="w-full px-4 py-6 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setLanguage('English');
                                            setIsLanguageOpen(false);
                                        }}
                                    >
                                        English
                                    </button>
                                    <button
                                        className="w-full px-4 py-6 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setLanguage('German / Deutsch');
                                            setIsLanguageOpen(false);
                                        }}
                                    >
                                        German / Deutsch
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="pt-4 border-t border-neutral-400 dark:border-neutral-800">
                            {/*<p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mb-4">FOLLOW US</p>*/}
                            <div className="flex mt-6 justify-center items-center space-x-4 mb-6">
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dark:text-neutral-400 text-neutral-600 hover:text-gray-600"
                                >
                                    <TbBrandMeta className="h-5 w-5" />
                                </a>
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dark:text-neutral-400 text-neutral-600 hover:text-gray-600"
                                >
                                    <IoLogoInstagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dark:text-neutral-400 text-neutral-600 hover:text-gray-600"
                                >
                                    <RiTwitterXLine className="h-4 w-4" />
                                </a>
                                <a
                                    href="mailto:shop@chasenorth.com"
                                    // target="_blank"
                                    // rel="no opener no referrer"
                                    className="dark:text-neutral-400 text-neutral-600 hover:text-gray-600"
                                >
                                    <TbMail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar
