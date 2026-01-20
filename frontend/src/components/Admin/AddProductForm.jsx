import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "@/redux/slices/adminProductSlice.js";
import { FiUpload } from "react-icons/fi";
import CustomSelect from "../Common/CustomSelect";
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
        sizeChartData: [],
        gender: "",
        tags: "",
        sizes: [],
        colors: [],
        images: [],
        colorImageMap: {}
    });
    
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

    // Gender and collections are now independent fields

    const [sizesInput, setSizesInput] = useState("");
    const [colorsInput, setColorsInput] = useState("");
    
    // Sync sizes with size chart
    useEffect(() => {
        const sizes = sizesInput
            .split(",")
            .map(s => s.trim().toUpperCase())
            .filter(Boolean);
            
        // Keep existing size chart data for sizes that still exist
        const existingData = formData.sizeChartData.filter(item => 
            sizes.includes(item.size)
        );
        
        // Add new sizes that don't exist in the size chart yet
        const newSizes = sizes.filter(size => 
            !formData.sizeChartData.some(item => item.size === size)
        ).map(size => ({
            size,
            width: "",
            length: "",
            sleeveCenterBack: ""
        }));
        
        // Only update if there are changes to avoid infinite loops
        if (newSizes.length > 0 || existingData.length !== formData.sizeChartData.length) {
            setFormData(prev => ({
                ...prev,
                sizeChartData: [...existingData, ...newSizes]
            }));
        }
    }, [sizesInput]);
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

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // If this color already has a mapped image, select it
        if (formData.colorImageMap[color] !== undefined) {
            const index = formData.images.findIndex(img => img.url === formData.colorImageMap[color]);
            setSelectedImageIndex(index);
        } else {
            setSelectedImageIndex(-1);
        }
    };

    const mapColorToImage = () => {
        if (!selectedColor || selectedImageIndex === -1) return;
        
        const selectedImage = formData.images[selectedImageIndex];
        
        setFormData(prevData => ({
            ...prevData,
            colorImageMap: {
                ...prevData.colorImageMap,
                [selectedColor]: selectedImage.url
            }
        }));
        
        toast.success(`Mapped ${selectedColor} to selected image`);
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
            
            const newImage = { url: data.imageUrl, altText: "" };
            
            setFormData(prevData => ({
                ...prevData,
                images: [...prevData.images, newImage],
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
        };
        
        // Ensure colorImageMap only contains valid colors
        const validColors = productData.colors;
        const filteredColorImageMap = {};
        
        Object.entries(productData.colorImageMap).forEach(([color, imageUrl]) => {
            if (validColors.includes(color)) {
                filteredColorImageMap[color] = imageUrl;
            }
        });
        
        productData.colorImageMap = filteredColorImageMap;
        
        dispatch(createProduct({ productData, token: user.token }))
            .unwrap()
            .then(() => {
                toast.success("Product added successfully!");
                navigate("/admin/products");
            })
            .catch((error) => {
                toast.error(error.message || "Failed to add product");
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                        <CustomSelect
                            value={formData.gender}
                            onChange={(value) => {
                                const event = {
                                    target: {
                                        name: 'gender',
                                        value: value
                                    }
                                };
                                handleChange(event);
                            }}
                            placeholder="Select Gender"
                            options={[
                                { value: 'Men', label: 'Men' },
                                { value: 'Women', label: 'Women' },
                                { value: 'Unisex', label: 'Unisex' }
                            ]}
                            tabIndex="0"
                        />
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

                {/* Size Chart */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Size Chart</label>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-neutral-100 dark:bg-neutral-800">
                                    <th className="p-2 border border-neutral-300 dark:border-neutral-700 text-left">Size</th>
                                    <th className="p-2 border border-neutral-300 dark:border-neutral-700 text-left">Width (cm)</th>
                                    <th className="p-2 border border-neutral-300 dark:border-neutral-700 text-left">Length (cm)</th>
                                    <th className="p-2 border border-neutral-300 dark:border-neutral-700 text-left">Sleeve Center Back (cm)</th>
                                    <th className="p-2 border border-neutral-300 dark:border-neutral-700 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.sizeChartData.map((row, index) => (
                                    <tr key={index} className="bg-white dark:bg-neutral-900">
                                        <td className="p-2 border border-neutral-300 dark:border-neutral-700">
                                            <input
                                                type="text"
                                                value={row.size}
                                                onChange={(e) => {
                                                    const updatedData = [...formData.sizeChartData];
                                                    updatedData[index].size = e.target.value;
                                                    setFormData(prev => ({ ...prev, sizeChartData: updatedData }));
                                                }}
                                                className="w-full p-1 border rounded dark:bg-neutral-800 dark:text-neutral-50"
                                            />
                                        </td>
                                        <td className="p-2 border border-neutral-300 dark:border-neutral-700">
                                            <input
                                                type="number"
                                                value={row.width}
                                                onChange={(e) => {
                                                    const updatedData = [...formData.sizeChartData];
                                                    updatedData[index].width = e.target.value;
                                                    setFormData(prev => ({ ...prev, sizeChartData: updatedData }));
                                                }}
                                                className="w-full p-1 border rounded dark:bg-neutral-800 dark:text-neutral-50"
                                            />
                                        </td>
                                        <td className="p-2 border border-neutral-300 dark:border-neutral-700">
                                            <input
                                                type="number"
                                                value={row.length}
                                                onChange={(e) => {
                                                    const updatedData = [...formData.sizeChartData];
                                                    updatedData[index].length = e.target.value;
                                                    setFormData(prev => ({ ...prev, sizeChartData: updatedData }));
                                                }}
                                                className="w-full p-1 border rounded dark:bg-neutral-800 dark:text-neutral-50"
                                            />
                                        </td>
                                        <td className="p-2 border border-neutral-300 dark:border-neutral-700">
                                            <input
                                                type="number"
                                                value={row.sleeveCenterBack}
                                                onChange={(e) => {
                                                    const updatedData = [...formData.sizeChartData];
                                                    updatedData[index].sleeveCenterBack = e.target.value;
                                                    setFormData(prev => ({ ...prev, sizeChartData: updatedData }));
                                                }}
                                                className="w-full p-1 border rounded dark:bg-neutral-800 dark:text-neutral-50"
                                            />
                                        </td>
                                        <td className="p-2 border border-neutral-300 dark:border-neutral-700">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedData = [...formData.sizeChartData];
                                                    updatedData.splice(index, 1);
                                                    setFormData(prev => ({ ...prev, sizeChartData: updatedData }));
                                                }}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                sizeChartData: [...prev.sizeChartData, { size: '', width: '', length: '', sleeveCenterBack: '' }]
                            }));
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Add Size Row
                    </button>
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