import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/adminSlice.js";
import {BiTrash} from "react-icons/bi";
import {FiPlus} from "react-icons/fi";

const UserManagement = () => {
    const { theme } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { users, loading, error } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers());
        }
    }, [dispatch, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData));
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer",
        });
    };

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }));
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId));
        }
    };

    const inputClasses = `w-full p-2 rounded-md ${
        theme === 'dark'
            ? 'bg-neutral-800 text-neutral-50'
            : 'bg-neutral-100'
    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`;

    const cardClasses ="p-6 rounded-lg mb-6";

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>

            {loading && <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className={cardClasses}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Add New User
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <label className={`block mb-1`}>
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className={`block mb-1`}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className={`block mb-1`}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className={`block mb-1`}>
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={inputClasses}
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 pr-6 rounded-full transition-colors flex items-center gap-2"
                    >
                        <FiPlus size={18}/>
                        <span>Add User</span>
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-neutral-300 font-bold text-left text-xs text-neutral-800 uppercase">
                    <tr>
                        <th className="px-4 py-3 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-4 py-3 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-4 py-3 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-4 py-3 text-center uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="">
                    {users.map((user) => (
                        <tr
                            key={user._id}
                            className="group border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 hover:dark:bg-accent"
                        >
                            <td className={`px-4 py-4 whitespace-nowrap ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                                {user.name}
                            </td>
                            <td className={`px-4 py-4 whitespace-nowrap ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                                {user.email}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    className={`p-1.5 rounded border ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user._id);
                                        }}
                                        className="flex items-center justify-center bg-red-500 text-white px-1 py-2 rounded-full hover:bg-red-600 w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <BiTrash className="text-xl"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;