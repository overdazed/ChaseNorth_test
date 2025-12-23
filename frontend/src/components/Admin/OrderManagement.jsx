import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import {useEffect} from "react";
import {fetchAllOrders, updateOrderStatus} from "../../redux/slices/adminOrderSlice.js";

const { theme } = useOutletContext();

const OrderManagement = () => {

    const theme = useOutletContext();

    // const orders = [
    //     {
    //         _id: 12345,
    //         user: {
    //             name: "John Doe",
    //         },
    //         totalPrice: 110,
    //         status: "Processing",
    //     }
    // ]

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // Get user from authSlice
    const { user } = useSelector((state) => state.auth);
    // Get orders from orderSlice
    const { orders, loading, error } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        // If user is not admin, redirect to home page
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);


    const handleStatusChange = (orderId, status) => {
        // TODO: Implement the logic to update the order status in the backend
        // For now, let's just log the new status
        // console.log({id: orderId, status});
        dispatch(updateOrderStatus({ id: orderId, status }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-4 py-3">Order ID</th>
                            <th scope="col" className="px-4 py-3">Customer</th>
                            <th scope="col" className="px-4 py-3">Total Price</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 hover:dark:bg-accent cursor-pointer"
                                >
                                    <td className="p-4 font-medium text-gray-900 hover:dark:text-neutral-200 whitespace-nowrap dark:text-neutral-300">
                                        #{order._id}
                                    </td>
                                    <td className="p-4 text-gray-900 hover:dark:text-neutral-200 whitespace-nowrap dark:text-neutral-300">{order.user?.name}</td>
                                    <td className="p-4 text-gray-900 hover:dark:text-neutral-200 whitespace-nowrap dark:text-neutral-300">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4 text-gray-900 hover:dark:text-neutral-200 whitespace-nowrap dark:text-neutral-300">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                        }
                                        className={`p-1.5 rounded border ${
                                            theme === 'dark'
                                                ? 'bg-transparent border-gray-600 text-neutral-400'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleStatusChange(order._id, "Delivered")}
                                            className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700"
                                        >Mark as Delivered</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No Orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default OrderManagement

// Add the route in App.jsx