import { Link } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {deleteProduct, fetchAdminProducts} from "../../redux/slices/adminProductSlice.js";

const ProductManagement = () => {

    // const products = [
    //     {
    //         _id: 1234,
    //         name: "Shirt",
    //         price: 110,
    //         sku: "5643456",
    //     }
    // ]
    const dispatch = useDispatch();

    const { products, loading, error } = useSelector((state) => state.adminProducts);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        // delete the product with the given id
        if(window.confirm("Are you sure you want to delete this Product?")) {
            // console.log("Delete Product with id:", id);
            dispatch(deleteProduct(id));
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Product Management</h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) =>
                                <tr
                                    key={product._id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product.name}
                                    </td>
                                    <td className="p-4">${product.price}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4">
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>)
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">
                                    No Products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ProductManagement

// add the route in App.jsx