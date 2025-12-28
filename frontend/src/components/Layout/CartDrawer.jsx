import CartContents from "../Cart/CartContents.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import AnimatedHamburgerButton from "../ui/AnimatedHamburgerButton";

// Check if dark mode is enabled
const isDarkMode = () => {
    if (typeof document !== 'undefined') {
        return document.documentElement.classList.contains('dark');
    }
    return false;
};

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart, loading } = useSelector((state) => state.cart);
    const userId = user ? user._id : null;
    const [isDark, setIsDark] = useState(isDarkMode());
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch cart when component mounts or when user/guestId changes
    useEffect(() => {
        if (userId || guestId) {
            dispatch(fetchCart({ userId, guestId }));
        }
    }, [dispatch, userId, guestId]);

    // Update theme when it changes
    useEffect(() => {
        const handleThemeChange = (e) => {
            const isDark = e.detail?.isDarkMode ?? isDarkMode();
            setIsDark(isDark);
        };

        // Check theme on mount
        setIsDark(isDarkMode());

        // Listen for theme changes
        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    const handleCheckout = () => {
        toggleCartDrawer();
        if (!user) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    const handleClose = (e) => {
        e.stopPropagation();
        if (!isAnimating) {
            setIsAnimating(true);
            // Start the animation
            setTimeout(() => {
                toggleCartDrawer();
                // Reset animation state after animation completes
                setTimeout(() => setIsAnimating(false), 500);
            }, 0); // Small delay to ensure state updates
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
                drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
            onClick={handleClose}
        >
            {/* Drawer content */}
            <div
                className={`w-full md:w-3/4 lg:w-1/2 xl:w-[30rem] h-full shadow-lg transform transition-all duration-300 ease-in-out flex flex-col z-[101] ${
                    drawerOpen ? 'translate-x-0' : 'translate-x-full'
                } ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <AnimatedHamburgerButton
                        active={drawerOpen}
                        onClick={handleClose}
                        className={isDark ? 'text-gray-300' : 'text-gray-600'}
                    />
                </div>

                {/* Cart content */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <h2 className={`text-2xl uppercase mb-8 ${isDark ? 'text-neutral-50' : 'text-gray-900'}`}>Your Cart</h2>
                    {cart?.products?.length > 0 ? (
                        <CartContents cart={cart} userId={userId} guestId={guestId} />
                    ) : (
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Your cart is empty.</p>
                    )}
                </div>

                {/* Checkout Button */}
                <div className="p-4">
                    {cart?.products?.length > 0 && (
                        <>
                            <button
                                onClick={handleCheckout}
                                className="text-md w-full bg-black text-neutral-50 py-3 rounded-full font-normal hover:bg-gray-800 transition"
                            >
                                Checkout
                            </button>
                            <p className={`text-xs tracking-tighter mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Shipping, taxes and discounts calculated at checkout.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;