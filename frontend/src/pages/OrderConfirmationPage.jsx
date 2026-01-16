// const checkout = {
//     _id: "12345",
//     createdAt: new Date(),
//     checkoutItems: [
//         {
//             productId: "1",
//             name: "Jacket",
//             color: "black",
//             size: "M",
//             price: 150,
//             quantity: 1,
//             image: "https://picsum.photos/150?random=1",
//
//         },
//         {
//             productId: "2",
//             name: "T-Shirt",
//             color: "black",
//             size: "M",
//             price: 120,
//             quantity: 2,
//             image: "https://picsum.photos/150?random=2",
//
//         },
//     ],
//     shippingAddress: {
//         address: "123 Main St",
//         city: "New York",
//         country: "USA",
//     }
// }

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice.js";

// Helper function to calculate shipping cost based on country
const getShippingCost = (country) => {
    const shippingRates = {
        'United States': 10.00,
        'Canada': 15.00,
        'United Kingdom': 12.00,
        'Germany': 14.00,
        'France': 14.00,
        'Spain': 16.00,
        'Italy': 16.00,
        'Australia': 25.00,
        'Japan': 22.00,
        'China': 20.00,
    };
    return shippingRates[country] || 20.00; // Default shipping cost
};

const OrderConfirmationPage = () => {

    const dispatch = useDispatch();

    // Declare a const navigate
    const navigate = useNavigate();

    // Get checkout from the checkout slice
    const { checkout } = useSelector((state) => state.checkout);

    // Clear the cart when the order is confirmed
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart());
            localStorage.removeItem("cart");
        } else {
            navigate("/my-orders");
        }
    }, [checkout, dispatch, navigate]);

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        // add 10 days to the order date
        orderDate.setDate(orderDate.getDate() + 5);
        return orderDate.toLocaleDateString();
    }

    return (
        <div className="min-h-vh bg-neutral-50 dark:bg-neutral-950">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-center text-emerald-700 dark:text-emerald-500 mb-8">
                    Thank You For Your Order!
                </h1>

                {checkout && (
                    <div className="p-6 rounded-lg shadow-md  bg-white dark:bg-neutral-800">
                        <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-20 gap-4">
                            <div>
                                <h2 className="text-md sm:text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                                    Order ID: {checkout._id}
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-md">
                                    Order date: {new Date(checkout.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
                                    Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="mb-8 sm:mb-20 space-y-4">
                            {checkout.checkoutItems.map((item) => (
                                <div key={item.productId} className="flex items-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{item.name}</h4>
                                        <p className="text-neutral-500 dark:text-neutral-300 text-sm">
                                            {item.color} | {item.size}
                                        </p>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <p className="text-md font-medium text-neutral-900 dark:text-neutral-50">${item.price}</p>
                                        <p className="text-neutral-500 dark:text-neutral-300 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {/* Payment Information */}
                            <div className="md:col-span-1">
                                <h4 className="text-sm sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                                    Payment
                                </h4>
                                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                                    {checkout.paymentMethod || 'PayPal'}
                                </p>
                            </div>

                            {/* Shipping Information */}
                            <div className="md:col-span-1">
                                <h4 className="text-sm sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                                    Delivery
                                </h4>
                                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                                    {checkout.shippingAddress.firstName} {checkout.shippingAddress.lastName}
                                </p>
                                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                                    {checkout.shippingAddress.address}
                                </p>
                                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                                    {checkout.shippingAddress.postalCode} {checkout.shippingAddress.city}
                                </p>
                                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                                    {checkout.shippingAddress.country}
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="md:col-span-1 mt-6 md:mt-0">
                                    <h4 className="text-sm sm:text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-50">
                                        Order Summary
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
                                            <span>Subtotal</span>
                                            <span>
                                                ${checkout.subtotal?.toFixed(2) || 
                                                  checkout.checkoutItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'}
                                            </span>
                                        </div>

                                        {checkout.discount?.amount > 0 && (
                                            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
                                                <span>Discount {checkout.discount.percentage > 0 ? `(${checkout.discount.percentage}% off)` : ''}</span>
                                                <span className="text-green-600">-${checkout.discount.amount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
                                            <span>Shipping</span>
                                            <span>
                                                {checkout.discount?.isFreeShipping ? (
                                                    <span className="text-green-600">Free!</span>
                                                ) : checkout.shippingCost > 0 ? (
                                                    `$${checkout.shippingCost.toFixed(2)}`
                                                ) : checkout.shippingAddress?.country ? (
                                                    (() => {
                                                        const countryName = checkout.shippingAddress.country;
                                                        const shippingCost = getShippingCost(countryName);
                                                        return `$${shippingCost.toFixed(2)}`;
                                                    })()
                                                ) : (
                                                    'Not available'
                                                )}
                                            </span>
                                        </div>

                                        <div className="border-t border-neutral-200 dark:border-neutral-600 my-3"></div>

                                        <div className="flex justify-between font-semibold text-neutral-600 dark:text-neutral-300">
                                            <span>Total</span>
                                            <span>
                                                {(() => {
                                                    // Calculate subtotal from items if not provided
                                                    const subtotal = checkout.subtotal ||
                                                        checkout.checkoutItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

                                                    // Get shipping cost - set to 0 if free shipping is applied
                                                    let shippingCost = 0;
                                                    if (!checkout.discount?.isFreeShipping) {
                                                        if (checkout.shippingCost > 0) {
                                                            shippingCost = checkout.shippingCost;
                                                        } else if (checkout.shippingAddress?.country) {
                                                            shippingCost = getShippingCost(checkout.shippingAddress.country);
                                                        }
                                                    }

                                                    // Apply discount if any
                                                    const discountAmount = checkout.discount?.amount || 0;

                                                    // Calculate total (subtotal - discount + shipping)
                                                    const total = (subtotal - discountAmount) + shippingCost;

                                                    // Return formatted total
                                                    return `$${total.toFixed(2)}`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default OrderConfirmationPage

// add route in App.jsx