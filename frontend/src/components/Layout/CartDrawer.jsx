import CartContents from "../Cart/CartContents.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import AnimatedHamburgerButton from "../ui/AnimatedHamburgerButton";

// Helper function to check if it's daytime (between 6 AM and 6 PM)
const isDaytime = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18;
};

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart, loading } = useSelector((state) => state.cart);
    const userId = user ? user._id : null;
    const [isDay, setIsDay] = useState(isDaytime());
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch cart when component mounts or when user/guestId changes
    useEffect(() => {
        if (userId || guestId) {
            dispatch(fetchCart({ userId, guestId }));
        }
    }, [dispatch, userId, guestId]);

    // Update theme based on time of day
    useEffect(() => {
        const checkTime = () => {
            setIsDay(isDaytime());
        };

        // Check time on mount
        checkTime();

        // Set up interval to check time every minute
        const interval = setInterval(checkTime, 60000);

        return () => clearInterval(interval);
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
                } ${isDay ? 'bg-neutral-50' : 'bg-neutral-700'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <AnimatedHamburgerButton
                        active={drawerOpen}
                        onClick={handleClose}
                        className={isDay ? 'text-gray-600' : 'text-gray-300'}
                    />
                </div>

                {/* Cart content */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <h2 className={`text-2xl uppercase mb-8 ${isDay ? 'text-gray-900' : 'text-white'}`}>Your Cart</h2>
                    {cart?.products?.length > 0 ? (
                        <CartContents cart={cart} userId={userId} guestId={guestId} />
                    ) : (
                        <p className={isDay ? 'text-gray-700' : 'text-gray-300'}>Your cart is empty.</p>
                    )}
                </div>

                {/* Checkout Button */}
                <div className="p-4">
                    {cart?.products?.length > 0 && (
                        <>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                            >
                                Checkout
                            </button>
                            <p className={`text-sm tracking-tighter mt-3 text-center ${isDay ? 'text-gray-500' : 'text-gray-300'}`}>
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