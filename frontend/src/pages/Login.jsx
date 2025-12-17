import {useEffect, useState} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import login from "../assets/Login.jpg"
import { loginUser } from "../redux/slices/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {mergeCart} from "../redux/slices/cartSlice.js";

const Login = () => {

    // create state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    // local state to control button loading
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // make use of dispatch
    const dispatch = useDispatch()

    const navigate = useNavigate();

    // check the URL for certain value, redirect them if needed
    const location = useLocation();

    const { user, guestId, loading } = useSelector((state) => state.auth);

    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter and check if it's checkout or something else
    // or the home page
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    // Add a constant isCheckoutRedirect
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            const processAfterLogin = () => {
                // Check for pending wishlist items
                const pendingWishlist = JSON.parse(localStorage.getItem('pendingWishlist') || '[]');
                
                if (pendingWishlist.length > 0) {
                    // Get current wishlist
                    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                    // Merge and deduplicate
                    const updatedWishlist = [...new Set([...currentWishlist, ...pendingWishlist])];
                    // Save back to localStorage
                    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                    // Clear pending wishlist
                    localStorage.removeItem('pendingWishlist');
                }

                // Get the return URL from location state or default to home
                const from = location.state?.from || '/';
                
                // Check if we need to go to checkout or the stored location
                const redirectTo = isCheckoutRedirect ? "/checkout" : from;
                
                // Short delay to allow state updates to complete
                setTimeout(() => {
                    setIsLoggingIn(false);
                    navigate(redirectTo, { replace: true });
                }, 1000);
            };

            // check if cart has any products, check if guestId is present
            if (cart?.products.length > 0 && guestId) {
                // merge guest cart with user cart
                dispatch(mergeCart({ guestId, user })).then(() => {
                    processAfterLogin();
                });
            } else {
                processAfterLogin();
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch, location.state]);
    // prevent full page reload
    // for backend

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setIsLoggingIn(true);
        
        try {
            await dispatch(loginUser({ 
                email: email.trim().toLowerCase(), 
                password 
            })).unwrap();
        } catch (error) {
            console.error('Login error:', error);
            setError("Invalid e-mail or password! Try again.");
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <div className="flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form onSubmit={handleSubmit} action="" className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">ChaseNorth</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
                    <p className="text-center mb-6">
                        Enter your username and password to Login
                    </p>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg font-semibold
                        hover:bg-gray-800 transition" disabled={isLoggingIn}>
                        {isLoggingIn ? "loading..." : "Sign In"}
                    </button>
                    <p className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link
                            // This will encode our String to a value URI
                            to={`/register?redirect=${encodeURIComponent(redirect)}`}
                            className="text-blue-500 hover:underline ml-1">
                            Sign Up / Register
                        </Link>
                    </p>
                </form>
            </div>

            {/* for right side image */}
            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-full flex flex-colitems-center justify-center">
                    <img src={login} alt="Login to Account" className="h-[750px] w-full object-cover"/>
                </div>
            </div>
        </div>
    )
}
export default Login

// add Route in App.jsx