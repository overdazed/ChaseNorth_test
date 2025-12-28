import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const FilterSidebar = ({ onFilterApply, highestPrice = 0, currentCategory, products = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const priceFilterRef = useRef(null);
    
    // Price filter state
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: ''
    });
    
    // highestPrice is now destructured from props with default value of 0
    
    // Initialize price range from URL params
    useEffect(() => {
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        setPriceRange({
            min: minPrice || '',
            max: maxPrice || ''
        });
    }, [searchParams]);
    
    // Apply price filter
    const applyPriceFilter = () => {
        const params = new URLSearchParams(location.search);

        // Convert to numbers
        const minPrice = priceRange.min ? parseFloat(priceRange.min) : null;
        const maxPrice = priceRange.max ? parseFloat(priceRange.max) : null;

        // Clear existing price params
        params.delete('minPrice');
        params.delete('maxPrice');

        // Only set params if they have valid values
        if (minPrice !== null && !isNaN(minPrice) && minPrice >= 0) {
            params.set('minPrice', minPrice.toString());
        }
        if (maxPrice !== null && !isNaN(maxPrice) && maxPrice >= 0) {
            params.set('maxPrice', maxPrice.toString());
        }

        setSearchParams(params);
        
        // Close the sidebar on mobile when a filter is applied
        if (onFilterApply && window.innerWidth < 1024) {
            onFilterApply();
        }
    };
    
    // Clear price filter
    const clearPriceFilter = () => {
        setPriceRange({ min: '', max: '' });
        const params = new URLSearchParams(location.search);
        params.delete('minPrice');
        params.delete('maxPrice');
        setSearchParams(params);
        
        // Close the sidebar on mobile when a filter is applied
        if (onFilterApply && window.innerWidth < 1024) {
            onFilterApply();
        }
    };
    
    const handlePriceKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    };
    // Sample filter options
    const categories = ["Top Wear", "Bottom Wear"];
    const genders = ["All", "Men", "Women"];
    const materials = ["Cotton", "Polyester", "Wool"];
    const brands = ["Nike", "Adidas", "Puma"];
    
    // Get unique colors and sizes from the current products
    const colors = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        
        // Extract all colors from products
        const allColors = products.flatMap(product => 
            product.colors ? product.colors : []
        );
        
        // Remove duplicates and return
        return [...new Set(allColors)];
    }, [products]);

    // Get unique sizes from the current products
    const sizes = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        
        // Extract all sizes from products
        const allSizes = products.flatMap(product => 
            product.sizes ? product.sizes : []
        );
        
        // Remove duplicates, sort, and return
        return [...new Set(allSizes)].sort((a, b) => {
            const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
        });
    }, [products]);

    // State for filters
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: []
    });

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        const params = new URLSearchParams(location.search);

        // Handle gender filter specifically
        if (name === 'gender') {
            if (value === 'All') {
                params.delete('gender');
            } else if (value) {
                params.set('gender', value);
            } else {
                params.delete('gender');
            }
            setSearchParams(params);
        }

        if (name === 'color') {
            if (filters.color === value) {
                // If clicking the same color again, remove the filter
                params.delete('color');
                setFilters(prev => ({ ...prev, color: '' }));
            } else {
                // Set the new color filter
                params.set('color', value);
                setFilters(prev => ({ ...prev, color: value }));
            }
            setSearchParams(params);
        }

        if (name === 'category') {
            if (filters.category === value) {
                // If clicking the same category again, remove the filter
                params.delete('category');
                setFilters(prev => ({ ...prev, category: '' }));
            } else {
                // Set the new category filter
                params.set('category', value);
                setFilters(prev => ({ ...prev, category: value }));
            }
            setSearchParams(params);
        }

        if (name === 'size') {
            // Create a new array with the updated sizes
            let newSizes;
            if (filters.size.includes(value)) {
                // If size is already selected, remove it
                newSizes = filters.size.filter(size => size !== value);
            } else {
                // Otherwise add it
                newSizes = [...filters.size, value];
            }

            // Update the URL
            if (newSizes.length > 0) {
                params.set('size', newSizes.join(','));
            } else {
                params.delete('size');
            }
            setSearchParams(params);

            // Update local state
            setFilters(prev => ({
                ...prev,
                size: newSizes
            }));
        }

        // Update local state
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
                {colors.length > 0 ? (
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
                                title={color}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No colors available</p>
                )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Size</h4>
                {sizes.length > 0 ? (
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
                ) : (
                    <p className="text-sm text-gray-500">No sizes available</p>
                )}
            </div>

            {/* Price Filter */}
            <div className="mb-6" ref={priceFilterRef}>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="space-y-3">
                    <div className="text-xs text-gray-500">
                        The highest price is ${highestPrice.toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                placeholder="From"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                onKeyDown={handlePriceKeyDown}
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                placeholder="To"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                onKeyDown={handlePriceKeyDown}
                                min={priceRange.min || "0"}
                                step="0.01"
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between pt-2">
                        <button
                            onClick={clearPriceFilter}
                            className="text-sm text-gray-500 hover:text-black hover:underline"
                        >
                            Reset
                        </button>
                        <button
                            onClick={applyPriceFilter}
                            className="px-4 py-1.5 text-sm rounded bg-black text-white hover:bg-gray-800"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;