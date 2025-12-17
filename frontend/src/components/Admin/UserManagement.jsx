import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {addUser, deleteUser, fetchUsers, updateUser} from "../../redux/slices/adminSlice.js";


const UserManagement = () => {

    // Add some users

    // const users = [
    //     {
    //         _id: 1234545,
    //         name: "John Doe",
    //         email: "8oJtG@example.com",
    //         role: "admin",
    //     }
    // ]

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        // if user is present and he is not admin, navigate to home page
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        // If user is present and he is admin
        if (user && user.role === "admin") {
            dispatch(fetchUsers());
        }
    }, [dispatch, user]);

    // contains all the fields present in the form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", // default role
    });


    // e.target.name will replace the name of the field, and will be assigned to the value the user has entered
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // log the form data and test functionality
        // console.log("Submitted data:", formData);
        dispatch(addUser(formData));
        // reset the form after Submit button is clicked
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer", // default role
        });
    };

    const handleRoleChange = (userId, newRole) => {
        // console.log({id: userId, role: newRole});
        dispatch(updateUser({id: userId, role: newRole}));
    };

    const handleDeleteUser = (userId) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            // console.log("deleting user with ID:", userId);
            dispatch(deleteUser(userId));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {/* Add new user form */}
            <div className="p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >Add User</button>
                </form>
            </div>

            {/* User List Management */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-4 py-3">
                                Name
                            </th>
                            <th className="px-4 py-3">
                                Email
                            </th>
                            <th className="px-4 py-3">
                                Role
                            </th>
                            <th className="px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="p-2 border rounded"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    {/* Send user id to backend to delete the user */}
                                    <button onClick={() => handleDeleteUser(user._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Delete</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default UserManagement

// add the route in App.jsx