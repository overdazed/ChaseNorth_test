import React, { useState } from 'react';

const FilterSidebar = ({ onFilterApply }) => {
    // Sample filter options
    const categories = ["Top Wear", "Bottom Wear"];
    const genders = ["Men", "Women"];
    const colors = ["Red", "Blue", "Black", "Green", "Yellow"];
    const sizes = ["S", "M", "L", "XL"];
    const materials = ["Cotton", "Polyester", "Wool"];
    const brands = ["Nike", "Adidas", "Puma"];

    // State for filters
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        priceRange: [0, 100]
    });

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox'
                ? checked
                    ? [...prevFilters[name], value]
                    : prevFilters[name].filter(item => item !== value)
                : value
        }));

        // Close the sidebar on mobile when a filter is applied
        if (onFilterApply && window.innerWidth < 1024) {
            onFilterApply();
        }
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setFilters(prev => ({
            ...prev,
            priceRange: [0, newPrice]
        }));
    };

    return (
        <div className="w-64 p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Category</h4>
                <div className="space-y-1">
                    {categories.map(category => (
                        <label key={category} className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={filters.category === category}
                                onChange={handleFilterChange}
                                className="mr-2"
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Gender</h4>
                <div className="space-y-1">
                    {genders.map(gender => (
                        <label key={gender} className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={filters.gender === gender}
                                onChange={handleFilterChange}
                                className="mr-2"
                            />
                            {gender}
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Color</h4>
                <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                        <button
                            key={color}
                            type="button"
                            name="color"
                            value={color}
                            onClick={handleFilterChange}
                            className={`w-6 h-6 rounded-full ${filters.color === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            aria-label={color}
                        />
                    ))}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                        <label key={size} className="flex items-center">
                            <input
                                type="checkbox"
                                name="size"
                                value={size}
                                checked={filters.size.includes(size)}
                                onChange={handleFilterChange}
                                className="mr-1"
                            />
                            {size}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;