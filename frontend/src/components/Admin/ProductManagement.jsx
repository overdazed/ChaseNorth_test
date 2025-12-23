import { Link } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {deleteProduct, fetchAdminProducts} from "../../redux/slices/adminProductSlice.js";
import { useNavigate} from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";

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

    const navigate = useNavigate();

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
                    <thead className="bg-neutral-300 text-xs text-neutral-800 uppercase">
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
                                className="group border-b hover:bg-neutral-200 hover:dark:bg-accent"
                            >
                                <td className="p-4 font-medium text-gray-900 hover:dark:text-neutral-200 whitespace-nowrap dark:text-neutral-300">
                                    <Link to={`/product/${product._id}`} className="hover:underline">
                                        {product.name}
                                    </Link>
                                </td>
                                <td className="p-4">${product.price}</td>
                                <td className="p-4">{product.sku}</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/products/${product._id}/edit`);
                                            }}
                                            className="flex items-center justify-center gap-1 bg-yellow-500 text-white px-1 py-2 rounded-full hover:bg-yellow-600 w-9 h-9"
                                        >
                                            <FiEdit className="text-lg" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product._id);
                                            }}
                                            className="flex items-center justify-center bg-red-500 text-white px-1 py-2 rounded-full hover:bg-red-600 w-9 h-9"
                                        >
                                            <BiTrash className="text-xl"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
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