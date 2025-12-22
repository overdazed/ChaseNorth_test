import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {fetchUserOrders} from "../redux/slices/orderSlice.js";

const MyOrdersPage = () => {

    // state variable to hold the orders
    // const [orders, setOrders] = useState([]);

    // add a useNavigate hook for navigation
    const navigate = useNavigate();

    // useEffect(() => {
    //     // fetch the orders from the backend and set it to the "orders" state variable
    //     // Simulate fetching orders
    //     setTimeout(() => {
    //         const mockOrders = [
    //             {
    //                 _id: 12345,
    //                 createdAt: new Date(),
    //                 shippingAddress: {city: "New York", country: "USA", street: "123 Main St", zip: "12345"},
    //                 orderItems: [
    //                     {
    //                         name: "Product 1",
    //                         image: "https://picsum.photos/500/500?random=1"
    //                     }
    //                 ],
    //                 totalPrice: 100,
    //                 isPaid: true,
    //             },
    //             {
    //                 _id: 34564,
    //                 createdAt: new Date(),
    //                 shippingAddress: {city: "New York", country: "USA", street: "123 Main St", zip: "12345"},
    //                 orderItems: [
    //                     {
    //                         name: "Product 2",
    //                         image: "https://picsum.photos/500/500?random=2"
    //                     }
    //                 ],
    //                 totalPrice: 100,
    //                 isPaid: true,
    //             },
    //         ];
    //
    //         setOrders(mockOrders);
    //     }, 1000)
    // //     should be executed on page load
    // }, [])


    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [isDarkMode, setIsDarkMode] = useState(false)


    useEffect(() => {
        dispatch(fetchUserOrders());
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail.isDarkMode);
        };
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
        }

        window.addEventListener('themeChange', handleThemeChange);
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    } // handleRowClick

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    const bgClass = isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
    const textClass = isDarkMode ? 'text-neutral-50' : 'text-neutral-950'
    const linkClass = isDarkMode ? 'text-red-800' : 'text-accent'
    const innerBgClass = isDarkMode ? 'bg-neutral-700' : 'bg-neutral-50'
    const borderClass = isDarkMode ? 'border-neutral-700' : 'border-neutral-50'

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${textClass}`}>
                My Orders
            </h2>
            <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                <table className={`min-w-full text-left ${textClass}`}>
                    <thead className={`text-xs uppercase ${textClass} ${innerBgClass}`}>
                        <tr>
                            <th className="py-2 px-4 sm:py-3">Image</th>
                            <th className="py-2 px-4 sm:py-3">Order ID</th>
                            <th className="py-2 px-4 sm:py-3">Created</th>
                            {/*<th className="py-2 px-4 sm:py-3">Shipping Address</th>*/}
                            <th className="py-2 px-4 sm:py-3">Items</th>
                            <th className="py-2 px-4 sm:py-3">Price</th>
                            <th className="py-2 px-4 sm:py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr
                            key={order._id}
                            onClick={() => handleRowClick(order._id)}
                            className={`border-b hover:border-gray-50 cursor-pointer ${borderClass}`}>
                                {/* Order Image */}
                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    <img
                                        src={order.orderItems[0].image}
                                        alt={order.orderItems[0].name}
                                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"/>
                                </td>
                                {/* Order ID */}
                                <td
                                    className={`py-2 px-2 sm:py-4 sm:px-4 font-medium ${linkClass} whitespace-nowrap`}
                                >
                                    #{order._id}
                                </td>
                                <td className="py-2 px-2 sm:py-4 sm:px-4">

                                    {new Date(order.createdAt).toLocaleDateString()}
                                    {" "}
                                    {new Date(order.createdAt).toLocaleTimeString()}
                                </td>
                                {/* check if order shipping address is present */}
                                {/*<td className="py-2 px-2 sm:py-4 sm:px-4">*/}
                                {/*    /!* if it is present, show the shipping address *!/*/}
                                {/*    {order.shippingAddress ? `${order.shippingAddress.city}, */}
                                {/*    ${order.shippingAddress.country}` : "N/A"}*/}
                                {/*</td>*/}
                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    {order.orderItems.length}
                                </td>
                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    ${order.totalPrice}
                                </td>
                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    <span className={`${order.isPaid ? "bg-green-100 text-green-700" 
                                        : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                                    >
                                        {order.isPaid ? "Paid" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-4 px-4 text-center text-gray-500"
                            >
                                You have no orders
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default MyOrdersPage

// include in Profile.jsx component