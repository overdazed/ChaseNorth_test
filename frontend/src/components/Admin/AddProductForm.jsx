import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/slices/adminProductSlice";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

const AddProductForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        collections: "",
        material: "",
        gender: "",
        tags: "",
        sizes: [],
        colors: [],
        images: []
    });

    const [sizesInput, setSizesInput] = useState("");
    const [colorsInput, setColorsInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const inputClasses = "w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        
        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            
            setFormData(prevData => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
            
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const handleCommaInput = (e, setter) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            const value = e.target.value;
            if (!value.endsWith(", ")) {
                setter(prev => prev.trim().replace(/,+$/, "") + ", ");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const productDataToSend = {
            ...formData,
            user: user._id,
            sizes: sizesInput
                .split(",")
                .map(s => s.trim().toUpperCase())
                .filter(Boolean),
            colors: colorsInput
                .split(",")
                .map(c => capitalize(c.trim()))
                .filter(Boolean),
            tags: formData.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean),
            material: formData.material
                .split(",")
                .map(m => m.trim())
                .filter(Boolean),
            price: Number(formData.price),
            countInStock: Number(formData.countInStock),
            isFeatured: false,
            isPublished: false
        };

        try {
            await dispatch(createProduct(productDataToSend)).unwrap();
            navigate("/admin/products");
        } catch (err) {
            setError(err.message || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={inputClasses}
                        rows={4}
                        required
                    />
                </div>

                {/* Price, Discount Price & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block font-semibold mb-2">Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Discount Price</label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className={inputClasses}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Count In Stock *</label>
                        <input
                            type="number"
                            name="countInStock"
                            value={formData.countInStock}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                            min="0"
                        />
                    </div>
                </div>


                {/* Category, Brand & Collections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block font-semibold mb-2">Category *</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Collections *</label>
                        <input
                            type="text"
                            name="collections"
                            value={formData.collections}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                {/* Material & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block font-semibold mb-2">Material (comma-separated)</label>
                        <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={(e) => {
                                const input = e.target.value;
                                const formatted = input
                                    .split(',')
                                    .map((m) => {
                                        const trimmed = m.trimStart();
                                        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                                    })
                                    .join(', ');
                                setFormData(prev => ({
                                    ...prev,
                                    material: formatted
                                }));
                            }}
                            onKeyDown={(e) => {
                                if (e.key === ',') {
                                    e.preventDefault();
                                    const value = e.target.value;
                                    if (!value.endsWith(', ')) {
                                        const newValue = value.endsWith(' ') ? value : value + ', ';
                                        setFormData(prev => ({
                                            ...prev,
                                            material: newValue
                                        }));
                                    }
                                }
                            }}
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={inputClasses}
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated) *</label>
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
                        className={inputClasses}
                        required
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated) *</label>
                    <input
                        type="text"
                        name="colors"
                        value={colorsInput}
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
                        className={inputClasses}
                        required
                    />
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={(e) => {
                            const input = e.target.value;
                            const formatted = input
                                .split(',')
                                .map((t) => {
                                    const trimmed = t.trimStart();
                                    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                                })
                                .join(', ');
                            setFormData(prev => ({
                                ...prev,
                                tags: formatted
                            }));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ',') {
                                e.preventDefault();
                                const value = e.target.value;
                                if (!value.endsWith(', ')) {
                                    const newValue = value.endsWith(' ') ? value : value + ', ';
                                    setFormData(prev => ({
                                        ...prev,
                                        tags: newValue
                                    }));
                                }
                            }
                        }}
                        className={inputClasses}
                    />
                </div>

                {/* Product Images */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Images *</label>
                    <div className="mb-4">
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                            <FiUpload className="w-4 h-4" />
                            <span>Upload Image</span>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                                required
                            />
                        </label>
                        {uploading && <span className="ml-4 text-blue-600">Uploading image...</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="relative">
                                    <img
                                        src={image.url}
                                        alt={image.altText || `Product Image ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedImages = [...formData.images];
                                            updatedImages.splice(index, 1);
                                            setFormData(prev => ({
                                                ...prev,
                                                images: updatedImages
                                            }));
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                    {isLoading ? 'Adding Product...' : 'Add Product'}
                </button>

            </form>
        </div>
    );
};

export default AddProductForm;