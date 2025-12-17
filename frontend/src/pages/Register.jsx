import {useEffect, useState} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import register from "../assets/Register.jpg"
import { registerUser } from "../redux/slices/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {mergeCart} from "../redux/slices/cartSlice.js";

const Register = () => {

    const [name, setName] = useState("")

    // create state variables
    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    // local state to control button loading
    const [isSigningUp, setIsSigningUp] = useState(false);

    // make use of dispatch
    const dispatch = useDispatch()

    const navigate = useNavigate();

    // check the URL for certain value, redirect them if needed
    const location = useLocation();

    const { user, guestId } = useSelector((state) => state.auth);

    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter and check if it's checkout or something else
    // or the home page
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    // Add a constant isCheckoutRedirect
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            const delayNavigation = () => {
                setTimeout(() => {
                    setIsSigningUp(false); // stop showing loading on button
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                }, 1000); // 1200ms = 1.2 seconds
            };

            // check if cart has any products, check if guestId is present
            if (cart?.products.length > 0 && guestId) {
                // merge guest cart with user cart
                dispatch(mergeCart({ guestId, user })).then(() => {
                    // navigate to the checkout page
                    // navigate(isCheckoutRedirect ? "/checkout" : "/");
                    delayNavigation();
                });
            } else {
                // navigate to the checkout page
                // navigate(isCheckoutRedirect ? "/checkout" : "/");
                delayNavigation();
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);


    // prevent full page reload
    // for backend
    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log("User Registered:", {name, email, password})

        setIsSigningUp(true);

        // dispatch register user
        dispatch(registerUser({ name, email, password }))
    }

    return (
        <div className="flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form
                    onSubmit={handleSubmit}
                    action=""
                    className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">ChaseNorth</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
                    <p className="text-center mb-6">
                        Enter your username and password to Login
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your Name"
                        />
                    </div>
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
                        hover:bg-gray-800 transition" disabled={isSigningUp}>
                        {isSigningUp ? "loading..." : "Sign Up"}
                    </button>
                    <p className="mt-6 text-center text-sm">
                        Already have an account?{" "}
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline ml-1">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            {/* for right side image */}
            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-full flex flex-colitems-center justify-center">
                    <img src={register} alt="Register Image" className="h-[750px] w-full object-cover"/>
                </div>
            </div>
        </div>
    )
}
export default Register

// add Route in App.jsx

// add Route in App.jsx