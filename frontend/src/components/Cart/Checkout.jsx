import { useNavigate } from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import PaypalButton from "./PaypalButton.jsx";
import { countries, countryMap, isValidCountry, getCountrySuggestions } from "../../data/countries.jsx";
import { getShippingCost } from "../../data/shippingCosts";
import { parsePhoneNumberFromString, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import {useDispatch, useSelector} from "react-redux";
import {createCheckout} from "../../redux/slices/checkoutSlice.js";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice.js";
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const guestId = localStorage.getItem('guestId');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [checkoutId, setCheckoutId] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart , navigate]);

    const capitalizeFirstLetter = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const formRef = useRef(null);

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Check required fields
        const requiredFields = {
            firstName: "First name is required",
            lastName: "Last name is required",
            address: "Address is required",
            city: "City is required",
            postalCode: "Postal code is required",
            country: "Country is required",
            phone: "Phone number is required"
        };

        Object.keys(requiredFields).forEach(field => {
            if (!shippingAddress[field]?.trim()) {
                errors[field] = requiredFields[field];
                isValid = false;
            }
        });

        // Additional validation for phone number
        if (shippingAddress.phone) {
            const userCountry = shippingAddress.country.trim().toLowerCase();
            if (isValidCountry(userCountry)) {
                const countryCode = countryMap[userCountry];
                const phoneNumber = parsePhoneNumberFromString(shippingAddress.phone.trim(), countryCode);
                if (!phoneNumber || !phoneNumber.isValid()) {
                    errors.phone = 'Please enter a valid phone number';
                    isValid = false;
                }
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleCreateCheckout = async(e) => {
        e.preventDefault();

        // First validate the form
        if (!validateForm()) {
            return;
        }

        // Then validate phone number specifically
        const country = shippingAddress.country.trim();
        if (country) {
            const countryCode = countryMap[country.toLowerCase()];
            const phoneNumber = parsePhoneNumberFromString(shippingAddress.phone.trim(), countryCode);

            if (!phoneNumber || !phoneNumber.isValid()) {
                setFormErrors(prev => ({
                    ...prev,
                    phone: 'Please enter a valid phone number'
                }));
                return;
            }
        }

        // If all validations pass, proceed with form submission
        setIsFormSubmitted(true);

        // // Calculate shipping cost based on country
        // const cost = getShippingCost(country);
        // setShippingCost(cost);

        // Calculate shipping cost based on country
        const cost = getShippingCost(shippingAddress.country.trim());
        // Update the state for any UI updates
        setShippingCost(cost);

        // Prepare the complete shipping address with all fields
        const completeShippingAddress = {
            firstName: shippingAddress.firstName.trim(),
            lastName: shippingAddress.lastName.trim(),
            address: shippingAddress.address.trim(),
            city: shippingAddress.city.trim(),
            postalCode: shippingAddress.postalCode.trim(),
            country: shippingAddress.country.trim(),
            phone: shippingAddress.phone.trim()
        };

        const form = formRef.current;

        const requiredFields = [
            "firstName",
            "lastName",
            "address",
            "city",
            "postalCode",
            "country",
            "phone"
        ];

        let allValid = true;

        for (const name of requiredFields) {
            const input = form.elements.namedItem(name);
            if (input && typeof input.checkValidity === "function") {
                const valid = input.checkValidity();
                if (!valid) {
                    input.reportValidity();
                    allValid = false;
                    break;
                }
            }
        }

        if (!allValid) return;

        const phoneValueRaw = form.elements.namedItem("phone").value.trim();
        const userCountry = shippingAddress.country.trim();
        const countryLower = userCountry.toLowerCase();

        if (!isValidCountry(userCountry)) {
            const countryInput = form.elements.namedItem("country");
            const suggestions = getCountrySuggestions(userCountry);
            let errorMsg = "Please enter a valid country name";

            if (suggestions.length > 0) {
                errorMsg += ". Did you mean: " + suggestions.slice(0, 3).join(', ') + '?';
            }

            countryInput.setCustomValidity(errorMsg);
            countryInput.reportValidity();
            return;
        }

        const countryCode = countryMap[countryLower];
        const phoneNumber = parsePhoneNumberFromString(phoneValueRaw, countryCode);
        const exampleNumber = getExampleNumber(countryCode, examples);
        const exampleFormatted = exampleNumber ?
            exampleNumber.formatInternational() :
            `+${countryCode} XXX XXX XXXX`;

        if (!phoneNumber || !phoneNumber.isValid()) {
            const phoneInput = form.elements.namedItem("phone");
            phoneInput.setCustomValidity(
                `Please enter a valid phone number for ${countryCode}. Example: ${exampleFormatted}`
            );
            phoneInput.reportValidity();
            return
        } else {
            const phoneInput = form.elements.namedItem("phone");
            phoneInput.setCustomValidity("");
            setShippingAddress({
                ...shippingAddress,
                phone: phoneNumber.formatInternational()
            });
        }

        console.log('Sending to backend:', {
            shippingAddress: {
                ...shippingAddress,
            },
            cart: {
                products: cart.products,
                totalPrice: cart.totalPrice
            },
            timestamp: new Date().toISOString()
        });

        if (cart && cart.products.length > 0) {
            // Calculate subtotal (sum of all items' prices * quantities)
            const subtotal = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Apply discount to subtotal if discount is applied
            const discountedSubtotal = discountApplied
                ? subtotal - (discountAmount || 0)
                : subtotal;

            // // Calculate final total (discounted subtotal + shipping cost)
            // const finalShippingCost = (discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4)
            //     ? 0
            //     : shippingCost;

            // Use the calculated cost directly in the checkout creation
            const finalShippingCost = (discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4)
                ? 0
                : cost;  // Use the just calculated cost instead of the state

            const totalPrice = discountedSubtotal + finalShippingCost;

            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress: completeShippingAddress,
                    paymentMethod: "PayPal",
                    subtotal: subtotal, // Original subtotal before discount
                    discount: {
                        code: discountApplied ? discountCode : '',
                        amount: discountApplied ? discountAmount : 0,
                        percentage: discountApplied ? discountPercentage : 0,
                        isFreeShipping: discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4
                    },
                    shippingCost: finalShippingCost,
                    totalPrice: totalPrice
                })
            );
            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
            }
        }
    }

    const handlePaymentSuccess = async(details) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: "paid", paymentDetails: details},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            await handleFinalizeCheckout(checkoutId);
        } catch (error) {
            console.error(error);
        }
    }

    const validatePhoneNumber = (phone, country) => {
        if (!country) return true; // Skip validation if no country selected
        const countryCode = countryMap[country.toLowerCase()];
        if (!countryCode) return true; // Skip if country code not found

        const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
        return phoneNumber && phoneNumber.isValid();
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;

        if (value.includes('+') && !value.startsWith('+')) {
            value = '+' + value.replace(/\+/g, '');
        }

        let filteredValue = '';
        let plusCount = 0;

        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            if (char === '+') {
                if (i === 0 && plusCount === 0) {
                    filteredValue += char;
                    plusCount++;
                }
            } else if (/[\d\s()\-]/.test(char)) {
                filteredValue += char;
            }
        }

        if (filteredValue.length > 20) return;

        const newShippingAddress = {
            ...shippingAddress,
            phone: filteredValue,
        };

        // Clear previous error when user starts typing
        if (formErrors.phone) {
            setFormErrors(prev => ({
                ...prev,
                phone: undefined
            }));
        }

        // Update the phone number
        setShippingAddress(newShippingAddress);

        // Validate phone number if country is selected
        if (shippingAddress.country && filteredValue) {
            const isValid = validatePhoneNumber(filteredValue, shippingAddress.country);
            if (!isValid && filteredValue.length > 3) { // Only show error after some input
                setFormErrors(prev => ({
                    ...prev,
                    phone: 'Please enter a valid phone number for the selected country'
                }));
            }
        }
    };

    // Add this near your other state declarations
    const [isDiscountBeingApplied, setIsDiscountBeingApplied] = useState(false);

// Replace the current handleApplyDiscount function with this:
    const handleApplyDiscount = () => {
        if (isDiscountBeingApplied) return;
        setIsDiscountBeingApplied(true);

        try {
            const code = discountCode.trim().toUpperCase();
            const isFreeShipping = code === import.meta.env.VITE_DISCOUNT_CODE4;

            const discountCodes = {
                [import.meta.env.VITE_DISCOUNT_CODE1]: 10,
                [import.meta.env.VITE_DISCOUNT_CODE2]: 20,
                [import.meta.env.VITE_DISCOUNT_CODE3]: 5,
                [import.meta.env.VITE_DISCOUNT_CODE4]: 0,
                [import.meta.env.VITE_DISCOUNT_NL1]: 10,
                [import.meta.env.VITE_DISCOUNT_NL2]: 10,
                [import.meta.env.VITE_DISCOUNT_NL3]: 10,
                [import.meta.env.VITE_DISCOUNT_NL4]: 10,
                [import.meta.env.VITE_DISCOUNT_NL5]: 10,
                [import.meta.env.VITE_DISCOUNT_NL6]: 10,
                [import.meta.env.VITE_DISCOUNT_NL7]: 10,
                [import.meta.env.VITE_DISCOUNT_NL8]: 10,
                [import.meta.env.VITE_DISCOUNT_NL9]: 10,
                [import.meta.env.VITE_DISCOUNT_NL10]: 10
            };

            const discount = discountCodes[code];

            if (discount !== undefined) {
                if (isFreeShipping) {
                    const shippingSavings = shippingCost; // Save the shipping cost as discount amount
                    setShippingCost(0);
                    setDiscountApplied(true);
                    setDiscountPercentage(0);
                    setDiscountAmount(shippingSavings);
                    setDiscountedPrice(cart.totalPrice);
                    setDiscountError('');
                } else {
                    const discountAmt = cart.totalPrice * (discount / 100);
                    const newPrice = cart.totalPrice - discountAmt;
                    setDiscountApplied(true);
                    setDiscountPercentage(discount);
                    setDiscountAmount(discountAmt);
                    setDiscountedPrice(newPrice);
                    setDiscountError('');
                }
            } else {
                setDiscountError('Invalid discount code');
                setDiscountApplied(false);
                setDiscountedPrice(null);
                if (shippingCost === 0 && shippingAddress.country) {
                    const cost = getShippingCost(shippingAddress.country.trim());
                    setShippingCost(cost);
                }
            }
        } finally {
            setIsDiscountBeingApplied(false);
        }
    };

// Add this effect to handle clearing the discount when the code is cleared
    useEffect(() => {
        if (!discountCode.trim() && discountApplied) {
            setDiscountApplied(false);
            setDiscountPercentage(0);
            // Calculate shipping cost based on country
            if (shippingAddress.country) {
                const cost = getShippingCost(shippingAddress.country);
                // Only update shipping cost if discount doesn't provide free shipping
                if (!discountApplied || discountCode.trim().toUpperCase() !== import.meta.env.VITE_DISCOUNT_CODE4) {
                    setShippingCost(cost);
                }
            }
        }
    }, [discountCode, discountApplied, shippingAddress.country]);

// Add this handler for the discount code input
    const handleDiscountCodeChange = (e) => {
        const value = e.target.value;
        setDiscountCode(value);
        if (discountApplied) {
            setDiscountApplied(false);
            setDiscountPercentage(0);
            setDiscountedPrice(null);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            navigate("/order-confirmation");
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(
            removeFromCart({
                productId,
                guestId,
                userId: user?._id,
                size,
                color
            })
        );
    }

    // Handle adding or subtracting to cart
    // delta is the value that the user can add or subtract from the cart, delta > 1 for addition and delta > -1 for subtraction
    const handleUpdateQuantity = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId: user?._id,
                    size,
                    color
                })
            );
        }
    }

    if (loading) return <p>Loading cart ...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl uppercase">Checkout</h2>
                    {/*{isFormSubmitted && (*/}
                    {/*    <p className="text-sm text-yellow-600 mt-1">*/}
                    {/*        ⚠️ Please review your information before proceeding to payment*/}
                    {/*    </p>*/}
                    {/*)}*/}
                </div>
                {/* call a function "handleCreateCheckout" */}
                <form ref={formRef} onSubmit={handleCreateCheckout} >
                    {isFormSubmitted && Object.keys(formErrors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500">
                            <p className="text-red-700">Please fix the following errors:</p>
                            <ul className="list-disc list-inside mt-1">
                                {Object.values(formErrors).map((error, index) => (
                                    <li key={index} className="text-red-600 text-sm">{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4"><label className="block text-neutral-700">Email</label>
                        <input
                            type="email"
                            // name="email"
                            // value="user@example.com"
                            // if value is present, value will be user.email
                            value={user ? user.email : ""}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-neutral-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={shippingAddress.firstName}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: capitalizeFirstLetter(e.target.value)
                                    });
                                    if (formErrors.firstName) {
                                        setFormErrors(prev => ({
                                            ...prev,
                                            firstName: undefined
                                        }));
                                    }
                                }}
                                className={`w-full p-2 border rounded ${
                                    formErrors.firstName ? 'border-red-500' : ''
                                } ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                                required
                                pattern="[A-Za-z\s]+" // allows letters and spaces only
                                title="Please enter a valid name"
                                disabled={isFormSubmitted}
                            />
                            {formErrors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-neutral-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={shippingAddress.lastName}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: capitalizeFirstLetter(e.target.value)
                                    });
                                    if (formErrors.lastName) {
                                        setFormErrors(prev => ({
                                            ...prev,
                                            lastName: undefined
                                        }));
                                    }
                                }}
                                className={`w-full p-2 border rounded ${
                                    formErrors.lastName ? 'border-red-500' : ''
                                } ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                                required
                                pattern="[A-Za-z\s]+" // allows letters and spaces only
                                title="Please enter a valid last name"
                                disabled={isFormSubmitted}
                            />
                            {formErrors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neutral-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={shippingAddress.address}
                            // value="Sdfg 23"
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: capitalizeFirstLetter(e.target.value)
                                })
                            }
                            className={`w-full p-2 border rounded ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                            required
                            pattern="^[A-Za-zßüöäÜÖÄ.\s]+\s\d+.*$" // requires at least one digit anywhere in the string
                            title="Address must include a street name followed by a space and number"
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-neutral-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={shippingAddress.city}
                                // value="New York"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: capitalizeFirstLetter(e.target.value)
                                    })
                                }
                                className={`w-full p-2 border rounded ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                                required
                                pattern="^[A-Za-z\s]+$" // only allows letters
                                title="City name must contain only letters"
                                disabled={isFormSubmitted}
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-700">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={shippingAddress.postalCode}
                                // value="12345"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value.trim()
                                    })
                                }
                                className={`w-full p-2 border rounded ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                                required
                                pattern="^[0-9A-Z]{3,7}$"
                                maxLength="7"
                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                title="Postal code must be 3-7 characters (numbers and uppercase letters only)"
                                disabled={isFormSubmitted}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neutral-700">Country</label>
                        <div className="relative">
                            <select
                                name="country"
                                value={shippingAddress.country}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        country: e.target.value
                                    });
                                    // Clear any previous validation message
                                    e.target.setCustomValidity('');
                                }}
                                onMouseDown={() => !isFormSubmitted && setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setIsDropdownOpen(false)}
                                className={`w-full p-2 pr-8 border rounded appearance-none ${
                                    isFormSubmitted ? 'bg-neutral-100' : 'bg-white'
                                }`}
                                required
                                disabled={isFormSubmitted}
                            >
                                {/*<option value="" placeholder="Select a country..." className="text-neutral-400"></option>*/}
                                {/*<option value="" disabled hidden>Select a country...</option>*/}
                                <option value="" disabled hidden></option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>

                            <div className={`absolute inset-y-0 right-0 flex items-center pr-2 ${
                                isFormSubmitted ? 'pointer-events-none' : 'pointer-events-auto'
                            }`}>
                                {isDropdownOpen ? (
                                    <FaCaretRight className="text-neutral-400" />
                                ) : (
                                    <FaCaretDown className="text-neutral-400" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neutral-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={shippingAddress.phone}
                            onChange={handlePhoneChange}
                            className={`w-full p-2 border rounded ${
                                formErrors.phone ? 'border-red-500' : ''
                            } ${isFormSubmitted ? 'bg-neutral-100' : ''}`}
                            required
                            pattern="^\+?[0-9\s\-()]*$"
                            title="Enter a valid phone number"
                            disabled={isFormSubmitted}
                        />
                        {formErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                        )}
                    </div>
                    {/* if the checkout id is not present, show the continue to payment button*/}
                    <div className="text-center mb-4">
                        <p className="text-sm text-yellow-600 inline-block bg-yellow-50 px-4 py-2 rounded-md">
                            ⚠️ Please review your information before proceeding to payment
                        </p>
                    </div>
                    <div className="mt-4">
                        {!checkoutId ? (
                            <button
                                type="submit"
                                className={`w-full bg-black text-white py-3 rounded-full ${
                                    isFormSubmitted ? 'opacity-75' : ''
                                }`}
                            >
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                {/*<h3 className="text-lg mb-4">Pay with Paypal</h3>*/}
                                {/*{isFormSubmitted && (*/}
                                {/*    <div className="text-center mb-4">*/}
                                {/*        <p className="text-sm text-yellow-600 inline-block bg-yellow-50 px-4 py-2 rounded-md">*/}
                                {/*            ⚠️ Please review your information before proceeding to payment*/}
                                {/*        </p>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/* Paypal payment button Component */}
                                <PaypalButton
                                    amount={cart.totalPrice}
                                    onSuccess={handlePaymentSuccess}
                                    onError={(err) => {
                                        setIsFormSubmitted(true);
                                        if (!validateForm()) {
                                            return;
                                        }
                                        alert("Payment failed. Please try again.");
                                    }}
                                    onClick={() => {
                                        setIsFormSubmitted(true);
                                        return validateForm();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section: Summary of our Order */}
            <div className="bg-neutral-50 p-6 rounded-lg ">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 ">
                    {cart.products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-2 border-b"
                        >
                            <div className="flex items-start">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-24 object-cover mr-4"
                                />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-sm text-neutral-500">Size: {product.size}</p>
                                    <p className="text-sm text-neutral-500">Color: {product.color}</p>
                                    <div className="mt-2">
                                        <div className={`flex items-center border-[0.5px] border-neutral-300 w-32 rounded-md overflow-hidden`}>
                                            <button
                                                className={`w-10 h-10 flex items-center justify-center border-r border-neutral-300 hover:bg-neutral-200`}
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        product.productId,
                                                        -1,
                                                        product.quantity,
                                                        product.size,
                                                        product.color
                                                    )
                                                }
                                            >
                                                <span className="text-black">-</span>
                                            </button>
                                            <div className={`flex-1 text-center text-black `}>
                                                {product.quantity}
                                            </div>
                                            <button
                                                className={`w-10 h-10 flex items-center justify-center border-l border-neutral-300 hover:bg-neutral-200`}
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        product.productId,
                                                        1,
                                                        product.quantity,
                                                        product.size,
                                                        product.color
                                                    )
                                                }
                                            >
                                                <span className="text-black">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Price and remove button container */}
                            <div className="flex flex-col items-end justify-between">
                                <p className="text-xl">${product.price?.toLocaleString()}</p>
                                {/* Delete icon */}
                                <button
                                    onClick={() =>
                                        handleRemoveFromCart(
                                            product.productId,
                                            product.size,
                                            product.color
                                        )
                                    }
                                    className="p-1 hover:scale-110 transition-transform duration-200 self-end"
                                    aria-label="Remove item"
                                >
                                    <div className="relative p-1 w-8 h-8 flex items-center justify-center">
                                        {/*<div className="absolute top-0.2 w-8 h-8 rounded-full dark:bg-neutral-100"></div>*/}
                                        <svg viewBox="0 0 15 17.5" height="22" width="22" xmlns="http://www.w3.org/2000/svg" className="relative hover:fill-red-600">
                                            <path d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" transform="translate(-2.5 -1.25)" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Discount Code */}
                <div className="mb-4 pt-2">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Don't forget your discount code!"
                            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                            value={discountCode}
                            onChange={handleDiscountCodeChange}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            disabled={isFormSubmitted}
                        />
                        <button
                            className="bg-black text-white px-4 py-2 rounded-r hover:bg-neutral-800 transition-colors"
                            onClick={handleApplyDiscount}
                            disabled={isFormSubmitted || !discountCode.trim() || isDiscountBeingApplied}
                        >
                            {isDiscountBeingApplied ? 'Applying...' : 'Apply'}
                        </button>
                    </div>
                    {discountError && (
                        <p className="text-red-500 text-sm mt-1">{discountError}</p>
                    )}
                    {discountApplied && (
                        <p className="text-green-600 text-sm mt-1">
                            {discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4
                                ? 'Discount applied: free shipping'
                                : `Discount applied: ${discountPercentage}% off`}
                        </p>
                    )}
                </div>
                {/* Total Price */}
                <div className="flex justify-between items-center text-lg mb-2">
                    <p>Subtotal</p>
                    <p>
                        {discountApplied && discountCode.trim().toUpperCase() !== import.meta.env.VITE_DISCOUNT_CODE4 ? (
                            <span>
                                <span className="line-through text-neutral-400 mr-2">
                                    ${cart.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span>${discountedPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </span>
                        ) : (
                            `$${cart.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                    </p>
                </div>
                {/* Shipping */}
                {/*<div className="flex justify-between items-center text-lg">*/}
                {/*    <p>Shipping</p>*/}
                {/*    <p className={discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4 ? 'text-green-600 font-medium' : ''}>*/}
                {/*        {discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4 */}
                {/*            ? 'Free!' */}
                {/*            : (shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'calculated at checkout')}*/}
                {/*    </p>*/}
                {/*</div>*/}
                {discountApplied && (
                    <div className="flex justify-between items-center text-lg mt-2">
                        <p>Discount ({discountPercentage}% off)</p>
                        <p className="text-green-600">
                            -${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                )}
                <div className="flex justify-between items-center text-lg mt-2">
                    <p>Shipping</p>
                    <p className={discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4 ? 'text-green-600 font-medium' : ''}>
                        {discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4
                            ? 'Free!'
                            : (shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'calculated at checkout')}
                    </p>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold mt-4 border-t pt-4">
                    <p>Total</p>
                    <p>
                        {`$${(
                            (discountApplied ? discountedPrice : cart.totalPrice) +
                            (discountApplied && discountCode.trim().toUpperCase() === import.meta.env.VITE_DISCOUNT_CODE4 ? 0 : shippingCost)
                        ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </p>
                </div>


                {/* UI complete, work on Orders Confirmation page */}


            </div>
        </div>
    )
}
export default Checkout

// Add the route in App.jsx

