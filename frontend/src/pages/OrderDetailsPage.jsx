import { useParams } from "react-router-dom"
import React, { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrderDetails } from "../redux/slices/orderSlice"
import {TbFileEuro} from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {

    // this will provide the order id that we pass in the url
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    // declare a state variable to store the order details
    // const [orderDetails, setOrderDetails] = useState(null);

    // useEffect(() => {
    //     // declare sample Data to work with
    //     const mockOrderDetails = {
    //         _id: id,
    //         createdAt: new Date(),
    //         isPaid: true,
    //         isDelivered: false,
    //         paymentMethod: "PayPal",
    //         shippingMethod: "Standard",
    //         shippingAddress: {
    //             city: "New York",
    //             country: "USA",
    //         },
    //         orderItems: [
    //             {
    //                 productId: 1,
    //                 name: "Jacket",
    //                 price: 120,
    //                 quantity: 1,
    //                 image: "https://picsum.photos/150?random=1"
    //             },
    //             {
    //                 productId: 2,
    //                 name: "T-Shirt",
    //                 price: 20,
    //                 quantity: 2,
    //                 image: "https://picsum.photos/150?random=2"
    //             },
    //         ],
    //     };
    //     setOrderDetails(mockOrderDetails);
    // }, [id]);

    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.orders);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [existingReport, setExistingReport] = useState(null);

    // Add this inside the existing useEffect that fetches order details
    const checkExistingReport = async () => {
        try {
            const response = await fetch(`${API_URL}/api/reports/order/${id}`);
            const data = await response.json();

            if (!response.ok) {
                console.error('Error fetching report:', data.message || 'Unknown error');
                return;
            }

            if (data.success && data.data) {
                setExistingReport(data.data);
            }
        } catch (error) {
            console.error('Error checking for existing report:', error);
        }
    };

    useEffect(() => {
        checkExistingReport();
    }, [id]);

    useEffect(() => {
        dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        // Check for saved theme preference on initial load
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true)
        }

        // Listen for theme changes from DarkModeToggle
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail.isDarkMode)
        }

        window.addEventListener('themeChange', handleThemeChange)
        return () => {
            window.removeEventListener('themeChange', handleThemeChange)
        }
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Set background and text classes based on theme
    const bgClass = isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50 transition-colors duration-300'
    const textClass = isDarkMode ? 'text-neutral-100' : 'text-neutral-900'
    const linkClass = isDarkMode ? 'text-red-800' : 'text-accent'
    const innerBgClass = isDarkMode ? 'bg-neutral-800 p-4 rounded-lg' : 'bg-neutral-100 p-4 rounded-lg'
    const borderClass = isDarkMode ? 'border-neutral-700' : 'border-neutral-50'

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${textClass}`}>Order Details</h2>
            {/* check if the order details are present, if so, display them */}
            {!orderDetails ? (
                <p>No Order Details Found</p>
            ) : (
                <div className={` dark:bg-neutral-900 bg-neutral-50 p-4 border border-neutral-200 dark:border-neutral-900 sm:p-6 rounded-lg ${bgClass} ${textClass}`}>
                    {/* Order Info */}
                    <div className="flex flex-col sm:flex-row justify-between mb-8">
                        <div className="">
                            <h3 className="text-lg md:text-xl font-semibold">
                                Order ID: #{orderDetails._id}
                            </h3>
                            <p className="text-gray-600">
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                            <span
                                className={`${
                                    // Add !oderDetails to test if not paid
                                    orderDetails.isPaid 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-red-100 text-red-700"
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                                // Add !oderDetails to test if not paid
                            >{orderDetails.isPaid ? "Approved" : "Pending"}
                            </span>
                            <span
                                className={`${
                                    // Add !oderDetails to test if not paid
                                    orderDetails.isDelivered
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                } px-3 py-1 rounded-full text-sm font-medium mb-4`}
                                // Add !oderDetails to test if not paid
                            >{orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                            </span>

                            {/*/!* Add this Download Invoice button *!/*/}
                            {/*{orderDetails.isPaid && (*/}
                            {/*    <button*/}
                            {/*        onClsick={() => window.open(`/api/orders/${orderDetails._id}/invoice`, '_blank')}*/}
                            {/*        alert={ ("here will be a function")}*/}
                            {/*        className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"*/}
                            {/* Add this Download Invoice button */}
                            <div className="mb-2">
                                {orderDetails.isPaid && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Check for token in common storage locations
                                                const getAuthToken = () => {
                                                    // Check common token storage keys
                                                    const possibleKeys = ['token', 'userToken', 'authToken', 'accessToken', 'jwt'];
                                                    for (const key of possibleKeys) {
                                                        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
                                                        if (token) {
                                                            console.log(`Found token with key: ${key}`);
                                                            return token;
                                                        }
                                                    }
                                                    return null;
                                                };

                                                const token = getAuthToken();
                                                if (!token) {
                                                    console.log('Available localStorage keys:', Object.keys(localStorage));
                                                    throw new Error('You need to be logged in to download invoices');
                                                }

                                                console.log('Token found, length:', token.length);

                                                const response = await fetch(`/api/api/invoices/generate`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({ orderId: orderDetails._id })
                                                });

                                                if (response.status === 401) {
                                                    throw new Error('Session expired. Please log in again.');
                                                }

                                                if (!response.ok) {
                                                    const errorData = await response.json().catch(() => ({}));
                                                    throw new Error(errorData.message || 'Failed to generate invoice');
                                                }

                                                // Create a blob from the response
                                                const blob = await response.blob();

                                                // Create a URL for the blob
                                                const url = window.URL.createObjectURL(blob);

                                                // Create a temporary anchor element
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `invoice_${orderDetails._id}.pdf`;

                                                // Trigger the download
                                                document.body.appendChild(a);
                                                a.click();

                                                // Clean up
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (error) {
                                                console.error('Error downloading invoice:', error);
                                                alert(error.message || 'Failed to download invoice. Please try again.');
                                            }
                                        }}
                                        className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <TbFileEuro size={14}/>
                                        <span>Download Invoice</span>
                                    </button>
                                )}
                            </div>
                            {/* Replace the existing button with this */}
                            {existingReport ? (
                                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            existingReport.status === 'Resolved'
                ? 'bg-green-100 text-green-700'
                : existingReport.status === 'In Review'
                    ? 'bg-blue-100 text-blue-700'
                    : existingReport.status === 'Needs Info'
                        ? 'bg-purple-100 text-purple-700'
                        : existingReport.status === 'Archived'
                            ? 'bg-slate-100 text-slate-500'
                            : existingReport.status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700' // Default for 'Submitted'
        }`}>
            {existingReport.status || 'Submitted'} • {new Date(existingReport.createdAt).toLocaleDateString()}
        </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-start sm:items-end">
                                    <button
                                        onClick={() => navigate('/report', {
                                            state: {
                                                orderId: orderDetails._id,
                                                shippingAddress: orderDetails.shippingAddress
                                            }
                                        })}
                                        className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Report a problem</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer, Payment, Shipping Info */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 ${innerBgClass}`}>
                        {/* Payment Info*/}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                            <p>Payment Method: {orderDetails.paymentMethod}</p>
                            <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                            {/*<p>Shipping Method: {orderDetails.shippingMethod}</p>*/}
                            <p>Shipping Method: Standard</p>
                            <p>Address:{" "}
                                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
                            </p>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="overflow-x-auto">
                        <h4 className="text-lg font-semibold mb-4">Products</h4>
                        <table className="min-w-full text-gray-500 mb-4">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Unit Price</th>
                                    <th className="py-2 px-4 text-left">Quantity</th>
                                    <th className="py-2 px-4 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.orderItems.map((item) => (
                                    <tr key={item.productId} className="border-b">
                                        <td className="py-2 px-4 flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg mr-4"
                                            />
                                            <Link to={`/product/${item.productId}`}
                                                  className="text-blue-500 hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4">${item.price}</td>
                                        <td className="py-2 px-4">{item.quantity}</td>
                                        <td className="py-2 px-4">${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Back to Orders Link */}
                    {/* Add Route to /my-orders in App.jsx*/}

                    <Link
                        to="/my-orders"
                        className="flex-1 h-12 flex items-center justify-center rounded-full text-sm font-slim transition-colors duration-200 bg-black text-neutral-50 hover:bg-neutral-800"
                    >
                        Back to My Orders
                    </Link>

                    {/*<Link*/}
                    {/*    to="/my-orders"*/}
                    {/*    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"*/}
                    {/*>*/}
                    {/*    Back to My Orders*/}
                    {/*</Link>*/}
                {/*    If I click an Order ID in My Orders Page, nothing happens, because we haven't added the Link  */}
                {/*    Change it in MyOrdersPage.jsx  -> onClick={() => handleRowClick(order._id)}*/}
                </div>
            )}
            </div>
        </div>
    )
}
export default OrderDetailsPage

// add the route in App.jsx