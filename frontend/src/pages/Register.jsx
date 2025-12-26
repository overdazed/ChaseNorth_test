import {useEffect, useState} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import register from "../assets/Register.jpg"
import { registerUser } from "../redux/slices/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {mergeCart} from "../redux/slices/cartSlice";
import styled from "styled-components";
import {FaEye, FaEyeSlash} from "react-icons/fa6";

const Register = () => {

    const [name, setName] = useState("")

    // create state variables
    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    })

    const validatePassword = (pass) => {
        const newErrors = {
            minLength: pass.length >= 12,
            hasUppercase: /[A-Z]/.test(pass),
            hasLowercase: /[a-z]/.test(pass),
            hasNumber: /\d/.test(pass),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        }
        setPasswordErrors(newErrors)
        return Object.values(newErrors).every(Boolean)
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        validatePassword(newPassword)
    }

    const isPasswordValid = Object.values(passwordErrors).every(Boolean)

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
        <RegisterContainer>
            <FormContainer>
                <form onSubmit={handleSubmit} className="form">
                    <div className="flex-column">
                        <label>Name</label>
                    </div>
                    <div className="inputForm">
                        <svg height={20} viewBox="0 0 24 24" width={20} xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex-column">
                        <label>Email</label>
                    </div>
                    <div className="inputForm">
                        <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
                            <g id="Layer_3" data-name="Layer 3">
                                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016 .13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                            </g>
                        </svg>
                        <input
                            type="email"
                            className="input"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        <div className="flex-column">
                            <label>Password</label>
                        </div>
                        <div className="inputForm" style={{ position: 'relative' }}>
                            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
                                <path d="M336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                                <path d="M304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`input w-full ${password && !isPasswordValid ? 'border-red-500' : ''}`}
                                placeholder="Enter your Password"
                                value={password}
                                onChange={handlePasswordChange}
                                style={{ paddingRight: '40px' }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? (
                                    <FaEye size={16} className="text-neutral-500 hover:text-black"/>
                                ) : (
                                    <FaEyeSlash size={18} className="text-neutral-500 hover:text-black"/>
                                )}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
                                <ul className="space-y-2">
                                    <li className={`flex items-center ${passwordErrors.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className="mr-2">{passwordErrors.minLength ? '✓' : '•'}</span>
                                        At least 12 characters
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className="mr-2">{passwordErrors.hasUppercase ? '✓' : '•'}</span>
                                        1 uppercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className="mr-2">{passwordErrors.hasLowercase ? '✓' : '•'}</span>
                                        1 lowercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className="mr-2">{passwordErrors.hasNumber ? '✓' : '•'}</span>
                                        1 number
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className="mr-2">{passwordErrors.hasSpecialChar ? '✓' : '•'}</span>
                                        1 special character
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className={`button-submit ${!isPasswordValid || isSigningUp ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!isPasswordValid || isSigningUp}
                    >
                        {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    <p className="p">
                        Already have an account?{" "}
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="span">
                            Login
                        </Link>
                    </p>
                    <p className="p">Or With</p>
                    <div className="flex-row">
                        <button type="button" className="btn google">
                            <svg version="1.1" width={20} id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
                                <path style={{fill: '#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z" />
                                <path style={{fill: '#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
                                <path style={{fill: '#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                                <path style={{fill: '#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z" />
                            </svg>
                            Google
                        </button>
                        <button type="button" className="btn apple">
                            <svg version="1.1" height={20} width={20} id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22.773 22.773" style={{enableBackground: 'new 0 0 22.773 22.773'}} xmlSpace="preserve">
                                <g>
                                    <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                                    <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                                </g>
                            </svg>
                            Apple
                        </button>
                    </div>
                </form>
            </FormContainer>
            <ImageContainer>
                <img src={register} alt="Register for an account" />
            </ImageContainer>
        </RegisterContainer>
    )
}

// Styled components
const RegisterContainer = styled.div`
    display: flex;
    min-height: 100vh;
    width: 100%;
    background-color: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    transition: background-color 0.3s ease;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
    
    .dark & {
        background-color: #0a0a0a;
        color: #f5f5f5;
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 28rem;
    padding: 2rem;
    margin: 0 auto;
    
    @media (min-width: 768px) {
        width: 50%;
        padding: 4rem 2rem;
    }
    
    .dark & {
        background-color: #0a0a0a;
        color: #f5f5f5;
    }
    
    .form {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .inputForm {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 1rem;
        background-color: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        padding: 0.75rem 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        
        &:focus-within {
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
        }
        
        .dark & {
            background-color: #2d2d2d;
            border-color: #4a5568;
            color: #f5f5f5;
            
            input {
                color: #f5f5f5;
                
                &::placeholder {
                    color: #a0aec0;
                }
            }
        }
    }
    
    .input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 0.875rem;
        
        &::placeholder {
            color: #a0aec0;
        }
    }
    
    .button-submit {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background-color: #3b82f6;
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
        margin-top: 1rem;
        
        &:hover:not(:disabled) {
            background-color: #2563eb;
        }
        
        &:active:not(:disabled) {
            transform: translateY(1px);
        }
        
        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .dark & {
            background-color: #4f46e5;
            
            &:hover:not(:disabled) {
                background-color: #4338ca;
            }
        }
    }
    
    .p {
        text-align: center;
        margin: 1rem 0;
        color: #4a5568;
        
        .dark & {
            color: #a0aec0;
        }
        
        .span {
            color: #3b82f6;
            font-weight: 600;
            text-decoration: none;
            
            &:hover {
                text-decoration: underline;
            }
            
            .dark & {
                color: #818cf8;
            }
        }
    }
    
    .flex-row {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 1rem 0;
        
        @media (max-width: 640px) {
            flex-direction: column;
            align-items: center;
        }
    }
    
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background-color: white;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
        
        &:hover {
            background-color: #f8fafc;
        }
        
        &:active {
            transform: translateY(1px);
        }
        
        .dark & {
            background-color: #2d2d2d;
            border-color: #4a5568;
            color: #f5f5f5;
            
            &:hover {
                background-color: #374151;
            }
        }
    }
    
    .form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #ffffff;
        padding: 30px;
        width: 100%;
        max-width: 500px;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        
        .dark & {
            background-color: #2d2d2d;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
    }
    
    .inputForm {
        border: 1.5px solid #ecedec;
        border-radius: 10px;
        height: 48px;
        display: flex;
        align-items: center;
        
        .dark & {
            border-color: #4a5568;
            background-color: #2d2d2d;
        }
        padding-left: 10px;
        transition: 0.2s ease-in-out;
        margin-bottom: 4px;
    }
    
    .input {
        margin-left: 10px;
        border: none;
        width: 100%;
        height: 100%;
        outline: none;
        background: none;
        color: #151717;
    }
    
    .inputForm:focus-within {
        border: 1.5px solid #2d79f3;
    }
    
    .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        justify-content: space-between;
        margin: 6px 0;
    }
    
    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .flex-column > label {
        color: #151717;
        font-weight: 600;
        margin-bottom: 2px;
        font-size: 14px;
    }
    
    .flex-row > div > label {
        font-size: 14px;
        color: #151717;
        font-weight: 400;
    }
    
    .span {
        font-size: 14px;
        color: #2d79f3;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
    }
    
    .p {
        text-align: center;
        color: black;
        font-size: 14px;
        margin: 10px 0;
    }
    
    .button-submit {
        margin: 10px 0 8px 0;
        background-color: #151717;
        border: none;
        color: white;
        font-size: 15px;
        font-weight: 500;
        border-radius: 10px;
        height: 46px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }
    
    .button-submit:hover {
        background-color: #252727;
    }
    
    .button-submit:disabled {
        background-color: #a1a1a1;
        cursor: not-allowed;
    }
    
    .btn {
        margin-top: 8px;
        width: 100%;
        height: 46px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        gap: 8px;
        border: 1px solid #ededef;
        background-color: white;
        cursor: pointer;
        transition: 0.2s ease-in-out;
    }
    
    .btn:hover {
        border: 1px solid #2d79f3;
    }
`;

const ImageContainer = styled.div`
    flex: 1;
    overflow: hidden;
    
    @media (max-width: 768px) {
        display: none;
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export default Register;