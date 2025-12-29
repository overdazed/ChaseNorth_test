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

import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {clearCart} from "../redux/slices/cartSlice.js";

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
        orderDate.setDate(orderDate.getDate() + 10);
        return orderDate.toLocaleDateString();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-neutral-50 dark:bg-neutral-950">
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

                    <div className="grid grid-cols-2 gap-4 sm:gap-8">
                        <div>
                            <h4 className="text-xs sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                                Payment
                            </h4>
                            <p className="text-xs sm:text-mdr text-neutral-600 dark:text-neutral-300">PayPal</p>
                        </div>

                        <div>
                            <h4 className="text-xs sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                                Delivery
                            </h4>
                            <p className="text-xs sm:text-md text-neutral-600 dark:text-neutral-300 line-clamp-1">
                                {checkout.shippingAddress.firstName} {checkout.shippingAddress.lastName}
                            </p>
                            <p className="text-xs sm:text-md text-neutral-600 dark:text-neutral-300 line-clamp-1">
                                {checkout.shippingAddress.address}
                            </p>
                            <p className="text-xs sm:text-md text-neutral-600 dark:text-neutral-300">
                                {checkout.shippingAddress.postalCode} {checkout.shippingAddress.city}
                            </p>
                            <p className="text-xs sm:text-md text-neutral-600 dark:text-neutral-300">
                                {checkout.shippingAddress.country}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default OrderConfirmationPage

// add route in App.jsx