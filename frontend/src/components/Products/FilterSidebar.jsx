import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const FilterSidebar = ({
                           onFilterApply,
                           highestPrice = 0,
                           currentCategory,
                           products = [],
                           isDay = true,
                           onFilterChange,  // Add this
                           filters = {}     // Add default empty object
                       }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const priceFilterRef = useRef(null);

    // Theme classes
    const themeClasses = {
        container: isDay
            ? 'bg-neutral-50 text-neutral-900'
            : 'bg-neutral-900 text-neutral-100',
        header: isDay
            ? 'text-neutral-900 border-b border-neutral-200'
            : 'text-neutral-100 border-b border-neutral-700',
        section: isDay
            ? 'border-b border-neutral-200'
            : 'border-b border-neutral-700',
        label: isDay
            ? 'text-neutral-700'
            : 'text-neutral-300',
        input: isDay
            ? 'text-neutral-900 bg-neutral-50 border-neutral-300'
            : 'bg-neutral-800 border-neutral-600 text-neutral-50',
        priceInput: isDay
            ? 'bg-neutral-50 border-neutral-300'
            : 'bg-neutral-700 border-neutral-600 text-neutral-50',
        button: isDay
            ? 'bg-black text-neutral-50 hover:bg-neutral-900'
            : 'bg-black text-neutral-50 hover:bg-neutral-900',
        resetButton: isDay
            ? 'text-neutral-500 hover:text-black hover:underline'
            : 'text-neutral-400 hover:text-neutral-200 hover:underline'
    };

    // Price filter state
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: ''
    });

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
    // const [filters, setFilters] = useState({
    //     category: "",
    //     gender: "",
    //     color: "",
    //     size: [],
    //     material: [],
    //     brand: []
    // });

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        const params = new URLSearchParams(location.search);

        // Call the parent's onFilterChange if provided
        if (onFilterChange) {
            onFilterChange(e);
        }

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
        <div className={`-mt-28 h-screen w-full p-4 shadow-sm overflow-y-auto dark:bg-neutral-900 ${themeClasses.container}`}>
            <h3 className={`mt-40 text-lg font-semibold mb-4 pb-2 ${themeClasses.header}`}>
                Filters
            </h3>

            {/* Category Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Category</h4>
                <div className="space-y-1">
                    {categories.map(category => (
                        <label key={category} className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={filters.category === category}
                                onChange={handleFilterChange || onFilterChange}
                                className={`mr-2 ${themeClasses.input}`}
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Gender Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Gender</h4>
                <div className="space-y-1">
                    {genders.map(gender => (
                        <label key={gender} className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={filters.gender === gender}
                                onChange={handleFilterChange || onFilterChange}
                                className={`mr-2 ${themeClasses.input}`}
                            />
                            <span>{gender}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Color</h4>
                {colors.length > 0 ? (
                    <div className="grid grid-cols-7 gap-2">
                        {colors.map(color => (
                            <div key={color} className="flex flex-col items-center">
                                <button
                                    type="button"
                                    name="color"
                                    value={color}
                                    onClick={handleFilterChange || onFilterChange}
                                    className={`w-6 h-6 rounded-full mb-1 ${
                                        filters.color === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                                    }`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    aria-label={color}
                                    title={color}
                                />
                                <span className="text-[10px] text-center text-neutral-500 dark:text-neutral-400">
                        {color}
                    </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>No colors available</p>
                )}
            </div>

            {/* Size Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Size</h4>
                {sizes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <label key={size} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="size"
                                    value={size}
                                    checked={filters.size.includes(size)}
                                    onChange={handleFilterChange || onFilterChange}
                                    className={`mr-1 ${themeClasses.input}`}
                                />
                                <span>{size}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>No sizes available</p>
                )}
            </div>

            {/* Price Filter */}
            <div className="mb-6" ref={priceFilterRef}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Price Range</h4>
                <div className="space-y-3">
                    <div className={`text-xs ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        The highest price is ${highestPrice.toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                isDay ? 'text-neutral-500' : 'text-neutral-400'
                            }`}>$</span>
                            <input
                                type="number"
                                placeholder="From"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                onKeyDown={handlePriceKeyDown}
                                min="0"
                                step="0.01"
                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${
                                    themeClasses.priceInput
                                }`}
                            />
                        </div>
                        <span className={isDay ? 'text-neutral-400' : 'text-neutral-500'}>-</span>
                        <div className="relative flex-1">
                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                isDay ? 'text-neutral-500' : 'text-neutral-400'
                            }`}>$</span>
                            <input
                                type="number"
                                placeholder="To"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                onKeyDown={handlePriceKeyDown}
                                min={priceRange.min || "0"}
                                step="0.01"
                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${
                                    themeClasses.priceInput
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between pt-2">
                        <button
                            onClick={clearPriceFilter}
                            className={`text-sm ${themeClasses.resetButton}`}
                        >
                            Reset
                        </button>
                        <button
                            onClick={applyPriceFilter}
                            className={`px-5 py-2 text-sm rounded-full ${themeClasses.button}`}
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