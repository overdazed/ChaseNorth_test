import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { FaChartLine, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt, FaFileAlt } from "react-icons/fa"
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import { clearCart } from "../../redux/slices/cartSlice.js";

const AdminSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/")
    }

    return (
        <div className="p-6 bg-neutral-950 h-full min-h-screen md:min-h-0">
            <div className="mb-6">
                <Link to="/admin" className="text-2xl font-medium text-white">
                    ChaseNorth
                </Link>
            </div>

            <nav className="flex flex-col space-y-2">
                <a
                    href="/admin"
                    className={window.location.pathname === '/admin' 
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaChartLine size={20}/>
                    <span>Dashboard</span>
                </a>

                <a
                    href="/admin/users"
                    className={window.location.pathname === '/admin/users' 
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaUserGear size={20}/>
                    <span>Users</span>
                </a>

                <a
                    href="/admin/products"
                    className={window.location.pathname === '/admin/products' 
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaBoxOpen size={20}/>
                    <span>Products</span>
                </a>

                <a
                    href="/admin/orders"
                    className={window.location.pathname === '/admin/orders' 
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaClipboardList size={20}/>
                    <span>Orders</span>
                </a>

                <a
                    href="/admin/reports"
                    className={window.location.pathname === '/admin/reports' 
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaFileAlt size={20}/>
                    <span>Reports</span>
                </a>

                <NavLink
                    to="/"
                    className={({isActive}) => isActive
                        ? "bg-neutral-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                        : "text-neutral-300 hover:bg-neutral-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                    }
                >
                    <FaStore size={20}/>
                    <span>Shop</span>
                </NavLink>

                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-800 hover:bg-accent text-white py-2 px-4 rounded-full flex items-center justify-center space-x-2"
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