import {useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {fetchProductDetails, updateProduct} from "../../redux/slices/productsSlice.js";
import axios from "axios";

const EditProductPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    // get id from used params
    const {id} = useParams()
    // Get the selected product from productSlice
    const { selectedProduct, loading, error } = useSelector(
        (state) => state.products
    )

    // add state to hold the product information
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [
            // {
            //     url: "https://picsum.photos/150?random=1",
            // },
            // {
            //     url: "https://picsum.photos/150?random=2",
            // },
        ],
    });

    const [uploading, setUploading] = useState(false); // image uploading state

    useEffect(() => {
        if (id) {
            // If is present, pass id to fetchProductDetails
            dispatch(fetchProductDetails(id))
        }
    }, [dispatch, id])

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
            setSizesInput(selectedProduct.sizes?.join(", ") || "");
            setColorsInput(selectedProduct.colors?.join(", ") || "");
        }
    }, [selectedProduct])

    const [sizesInput, setSizesInput] = useState("");
    const [colorsInput, setColorsInput] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevData => (
            {
                ...prevData,
                [name]: value
            }
            ));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        // log the information that will be sent to the backend
        // console.log(file);
        const formData = new FormData();
        formData.append("image", file);
        try{
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            // setUploading((prevData) => ({
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, {url: data.imageUrl, altText: ""}],
            }))
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const updatedProductData = {
            ...productData,
            sizes: sizesInput
                .split(",")
                .map(s => s.trim().toUpperCase())
                .filter(Boolean),
            colors: colorsInput
            .split(",")
            .map(c => capitalize(c.trim()))
            .filter(Boolean)
        };

        // setProductData(prevData => ({
        //     ...prevData,
        //     sizes: sizesInput.split(",").map(size => size.trim()).filter(Boolean),
        //     colors: colorsInput.split(",").map(color => color.trim()).filter(Boolean),
        // }));

        // console.log({
        //     ...productData,
        //     sizes: sizesInput.split(",").map(size => size.trim()).filter(Boolean),
        //     colors: colorsInput.split(",").map(color => color.trim()).filter(Boolean),
        // });

        dispatch(updateProduct({id, productData: updatedProductData}))

        navigate("/admin/products")

    };

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    const handleCommaInput = (e, setter) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            // Get the current value
            const value = e.target.value;

            // If not already ending with comma-space, add it
            if (!value.endsWith(", ")) {
                setter(prev => prev.trim().replace(/,+$/, "") + ", ");
            }
        }
    };


    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                        required
                    />
                </div>
                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                        rows={4}
                        required
                    />
                </div>

                {/* Price Input */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>

                {/* Count In Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count In Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={sizesInput}
                        onChange={(e) => {
                            const input = e.target.value;
                            const uppercased = input
                                .split(",")
                                .map((s) => s.trim().toUpperCase())
                                .join(", ");
                            setSizesInput(uppercased);
                        }}
                        onKeyDown={(e) => handleCommaInput(e, setSizesInput)}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>
                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name="colors"
                        value={colorsInput}
                        // onChange={(e) => setColorsInput(e.target.value)}
                        onChange={(e) => {
                            const input = e.target.value;
                            const capitalized = input
                                .split(",")
                                .map((c) => {
                                    const trimmed = c.trimStart();
                                    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                                })
                                .join(", ");
                            setColorsInput(capitalized);
                        }}
                        onKeyDown={(e) => handleCommaInput(e, setColorsInput)}
                        className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>


                {/* Image Upload*/}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p>Uploading image...</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors"
                >
                    Update Product
                </button>

            </form>
        </div>
    )
}
export default EditProductPage

// add the route in App.jsx