import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { FaChartLine, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt } from "react-icons/fa"
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"

import {useDispatch} from "react-redux";
import {logout} from "../../redux/slices/authSlice.js";
import {clearCart} from "../../redux/slices/cartSlice.js";

const AdminSidebar = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()


    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        // for now just navigate to home page
        navigate("/")
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/admin" className="text-2xl font-medium">
                    {/*Rabbit*/}
                    ChaseNorth
                </Link>
            </div>
            {/*<h2 className="text-xl font-medium mb-6 text-center">Dashboard</h2>*/}

            <nav className="flex flex-col space-y-2">
                {/* check if the link is active or not */}
                <NavLink
                    to="/admin"
                    end // Add this prop to match exactly
                    className={({isActive}) => isActive
                        ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaChartLine size={20}/>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className={({isActive}) => isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaUserGear size={20}/>
                    <span>Users</span>
                </NavLink>
                <NavLink to="/admin/products" className={({isActive}) => isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaBoxOpen size={20}/>
                    <span>Products</span>
                </NavLink>
                <NavLink to="/admin/orders" className={({isActive}) => isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaClipboardList size={20}/>
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/" className={({isActive}) => isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaStore size={20}/>
                    <span>Shop</span>
                </NavLink>

                {/* Logout Button */}
                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center
                        justify-center space-x-2"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}
export default AdminSidebar

// add in AdminLayout.jsx