import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {setFilters} from "@/redux/slices/productsSlice.js";
import { colorMap } from '@/utils/colorUtils.js';

const FilterSidebar = ({
                           onFilterApply,
                           highestPrice = 0,
                           currentCategory,
                           products = [],
                           isDay = true,
                           onFilterChange,  // Add this
                           filters = { size: [] },     // Add default empty object
                       }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const priceFilterRef = useRef(null);

    const [selectedBrands, setSelectedBrands] = useState([]);
    // const isInitialMount = useRef(true);

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
        // if (onFilterApply && window.innerWidth < 1024) {
        //     onFilterApply();
        // }
    };

    // Clear price filter
    const clearPriceFilter = () => {
        setPriceRange({ min: '', max: '' });
        const params = new URLSearchParams(location.search);
        params.delete('minPrice');
        params.delete('maxPrice');
        setSearchParams(params);

        // Close the sidebar on mobile when a filter is applied
        // if (onFilterApply && window.innerWidth < 1024) {
        //     onFilterApply();
        // }
    };

    const handlePriceKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    };
    // Sample filter options
    const categories = ['All', 'Top Wear', 'Bottom Wear'];
    const genders = ["All", "Men", "Women"];
    const brands = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        // Extract all brands from products
        const allBrands = products.map(product => product.brand).filter(Boolean);
        // Remove duplicates and sort alphabetically
        return [...new Set(allBrands)].sort();
    }, [products]);

    // Color name to hex mapping
    const colorMap = {
        'almond': '#EFDECD',
        'amber': '#FFBF00',
        'amethyst': '#9966CC',
        'apricot': '#FBCEB1',
        'aqua': '#00FFFF',
        'army green': '#4B5320',
        'baby blue': '#89CFF0',
        'banana': '#FFE135',
        'beige': '#F5F5DC',
        'black': '#000000',
        'blue': '#0000b9',
        'blush': '#DE5D83',
        'brick': '#8B0000',
        'brick red': '#CB4154',
        'bronze': '#CD7F32',
        'brown': '#A52A2A',
        'bubblegum': '#FFC1CC',
        'burgundy': '#800020',
        'burnt orange': '#CC5500',
        'butter': '#F6E0A5',
        'camel': '#C19A6B',
        'cantaloupe': '#FFA62F',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'champagne': '#F7E7CE',
        'charcoal': '#36454F',
        'cherry': '#D2042D',
        'chestnut': '#954535',
        'chocolate': '#7B3F00',
        'cobalt': '#0047AB',
        'cobalt blue': '#0047AB',
        'coffee': '#6F4E37',
        'cocoa': '#D2691E',
        'copper': '#B87333',
        'coral': '#FF7F50',
        'cream': '#FFFDD0',
        'crimson': '#DC143C',
        'crystal': '#A7D8DE',
        'cyan': '#00FFFF',
        'dark blue': '#00006c',
        'dark green': '#006400',
        'denim': '#1560BD',
        'eggplant': '#614051',
        'eggshell': '#F0EAD6',
        'emerald': '#50C878',
        'emerald green': '#50C878',
        'forest green': '#228B22',
        'fuchsia': '#FF00FF',
        'gold': '#FFD700',
        'goldenrod': '#DAA520',
        'gray': '#808080',
        'green': '#008000',
        'grey': '#808080',
        'gunmetal': '#2A3439',
        'hazelnut': '#BDA55D',
        'heather gray': '#B6B6B4',
        'heather grey': '#B6B6B4',
        'honey': '#F0E68C',
        'hot pink': '#FF69B4',
        'hunter green': '#355E3B',
        'ice blue': '#99FFFF',
        'indigo': '#4B0082',
        'ivory': '#FFFFF0',
        'jade': '#00A86B',
        'kelly green': '#4CBB17',
        'khaki': '#F0E68C',
        'lavender': '#E6E6FA',
        'lemon': '#FFF44F',
        'lilac': '#C8A2C8',
        'lime': '#00FF00',
        'lime green': '#32CD32',
        'magenta': '#FF00FF',
        'mahogany': '#C04000',
        'maroon': '#800000',
        'mauve': '#E0B0FF',
        'mint': '#98FF98',
        'mint green': '#98FF98',
        'mocha': '#967969',
        'moss': '#8A9A5B',
        'mustard': '#FFDB58',
        'mustard yellow': '#FFDB58',
        'navy': '#00003d',
        'navy palms': '#1A3A3F',
        'neon green': '#39FF14',
        'off white': '#FAF9F6',
        'olive': '#808000',
        'olive drab': '#6B8E23',
        'olive green': '#808000',
        'orange': '#FFA500',
        'orchid': '#DA70D6',
        'peach': '#FFDAB9',
        'peanut': '#7B3F00',
        'pearl': '#EAE0C8',
        'periwinkle': '#CCCCFF',
        'pine': '#01796F',
        'pink': '#FFC0CB',
        'pistachio': '#93C572',
        'plum': '#DDA0DD',
        'powder blue': '#B0E0E6',
        'pumpkin': '#FF7518',
        'purple': '#800080',
        'red': '#ab0000',
        'rose': '#FF007F',
        'rose gold': '#B76E79',
        'royal blue': '#4169E1',
        'royal purple': '#7851A9',
        'ruby': '#E0115F',
        'rust': '#B7410E',
        'sage': '#9CAF88',
        'salmon': '#FA8072',
        'sand': '#F4A460',
        'sapphire': '#0F52BA',
        'scarlet': '#FF2400',
        'seafoam': '#9FE2BF',
        'silver': '#C0C0C0',
        'sky blue': '#87CEEB',
        'tan': '#D2B48C',
        'tangerine': '#F28500',
        'taupe': '#483C32',
        'teal': '#008080',
        'teal green': '#006D5B',
        'terracotta': '#E2725B',
        'tropical print': '#2E8B57',
        'turquoise': '#40E0D0',
        'vanilla': '#F3E5AB'
    };

    // Get unique colors, sizes, and materials from the current products
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

    // Get unique materials from the current products
    const availableMaterials = React.useMemo(() => {
        if (!products || products.length === 0) return [];

        // Extract all materials from products
        const allMaterials = products.flatMap(product =>
            product.material ? [product.material] : []
        );

        // Remove duplicates and sort alphabetically
        return [...new Set(allMaterials)].sort();
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

    const handleBrandChange = (brand) => {
        const newSelectedBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];

        // Update URL
        const params = new URLSearchParams(location.search);
        if (newSelectedBrands.length > 0) {
            params.set('brand', newSelectedBrands.join(','));
        } else {
            params.delete('brand');
        }

        // Update state and URL
        setSelectedBrands(newSelectedBrands);
        setSearchParams(params, { replace: true });

        // Notify parent component
        if (onFilterChange) {
            onFilterChange({
                target: {
                    name: 'brand',
                    value: newSelectedBrands
                }
            });
        }
    };

    // Check if a brand is currently selected
    // const isBrandSelected = (brand) => {
    //     return selectedBrands.includes(brand);
    // };

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        const params = new URLSearchParams(location.search);

        // Call the parent's onFilterChange if provided
        if (onFilterChange) {
            onFilterChange(e);
        }

        // Handle gender filter specifically
        // Handle URL updates for specific filter types
        if (name === 'gender') {
            if (value === 'All') {
                params.delete('gender');
            } else if (value) {
                params.set('gender', value);
            } else {
                params.delete('gender');
            }
            setSearchParams(params);
        } else if (name === 'color') {
            if (filters.color === value) {
                params.delete('color');
            } else {
                params.set('color', value);
            }
            setSearchParams(params);
        } else if (name === 'category') {
            if (filters.category === value) {
                params.delete('category');
            } else {
                params.set('category', value);
            }
            setSearchParams(params);
        } else if (name === 'material') {
            // Get current materials from URL or initialize empty array
            const currentMaterials = searchParams.get('material')
                ? searchParams.get('material').split(',')
                : [];

            let newMaterials;
            if (currentMaterials.includes(value)) {
                newMaterials = currentMaterials.filter(m => m !== value);
            } else {
                newMaterials = [...currentMaterials, value];
            }

            // Update URL parameters
            if (newMaterials.length > 0) {
                params.set('material', newMaterials.join(','));
            } else {
                params.delete('material');
            }
            setSearchParams(params);

            // Update parent component's state
            if (onFilterChange) {
                onFilterChange({
                    target: {
                        name: 'material',
                        value: newMaterials
                    }
                });
            }
        } else if (name === 'size') {
            // Get current sizes from URL or initialize empty array
            const currentSizes = searchParams.get('sizes')
                ? searchParams.get('sizes').split(',')
                : [];

            let newSizes;
            if (currentSizes.includes(value)) {
                newSizes = currentSizes.filter(size => size !== value);
            } else {
                newSizes = [...currentSizes, value];
            }

            // Create new params object based on current searchParams
            const params = new URLSearchParams(searchParams);
            if (newSizes.length > 0) {
                params.set('sizes', [...new Set(newSizes)].join(','));
            } else {
                params.delete('sizes');
            }
            setSearchParams(params, { replace: true });

            // Update the filters prop to reflect the change
            if (onFilterChange) {
                onFilterChange({
                    target: {
                        name: 'size',
                        value: newSizes
                    }
                });
            }
        }

        // Close the sidebar on mobile when a filter is applied
        // if (onFilterApply && window.innerWidth < 1024) {
        //     onFilterApply();
        // }
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? '' : parseFloat(value) || 0;
        const newPriceRange = {
            ...priceRange,
            [name]: numericValue };

        setPriceRange(newPriceRange);

        // Update URL parameters immediately
        const params = new URLSearchParams(location.search);

        if (name === 'min') {
            if (value !== '') {
                params.set('minPrice', numericValue);
            } else {
                params.delete('minPrice');
            }
        } else if (name === 'max') {
            if (value !== '') {
                params.set('maxPrice', numericValue);
            } else {
                params.delete('maxPrice');
            }
        }

        setSearchParams(params);

        // Call the parent's onFilterChange if provided
        if (onFilterChange) {
            onFilterChange({
                target: {
                    name: 'priceRange',
                    value: newPriceRange
                }
            });
        }
    };


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const brandsParam = params.get('brand');
        const brandsFromUrl = brandsParam ? brandsParam.split(',').filter(Boolean) : [];
        setSelectedBrands(brandsFromUrl);
    }, [location.search]);

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

            {/* Material Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Material</h4>
                {availableMaterials.length > 0 ? (
                    <div className="filter-options space-y-1">
                        {availableMaterials.map(material => (
                            <label key={material} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="material"
                                    value={material}
                                    checked={filters.material?.includes(material) || false}
                                    onChange={handleFilterChange}
                                    className={`mr-2 ${themeClasses.input}`}
                                />
                                <span>{material}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        No materials available
                    </p>
                )}
            </div>

            {/* Brand Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Brand</h4>
                {brands.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto filter-options space-y-1">
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="brand"
                                    value={brand}
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                    className={`mr-2 ${themeClasses.input}`}
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className={`text-sm ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        No brands available
                    </p>
                )}
            </div>

            {/* Color Filter */}
            <div className={`mb-6 pb-4 ${themeClasses.section}`}>
                <h4 className={`font-medium mb-2 ${themeClasses.label}`}>Color</h4>
                {colors.length > 0 ? (
                    <div className="grid grid-cols-7 gap-2">
                        {colors.map(color => {
                            // Get the hex code from the color map, or use the color as-is if it's already a hex code
                            const colorValue = colorMap[color.toLowerCase()] || color;
                            const isSelected = filters.colors?.includes(color) || false;
                            return (
                                <div key={color} className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        name="colors"
                                        value={color}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newColors = isSelected
                                                ? filters.colors?.filter(c => c !== color) || []
                                                : [...(filters.colors || []), color];

                                            if (onFilterChange) {
                                                onFilterChange({
                                                    target: {
                                                        name: 'colors',
                                                        value: newColors
                                                    }
                                                });
                                            }
                                        }}
                                        className={`w-6 h-6 rounded-full mb-1 ${
                                            isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                                        }`}
                                        style={{
                                            backgroundColor: colorValue,
                                            // Add a border for light colors to make them visible on white background
                                            border: colorValue === '#FFFFFF' || colorValue === '#FFF' ? '1px solid #E5E7EB' : 'none'
                                        }}
                                        aria-label={color}
                                        title={color}
                                    />
                                    <span className="text-[10px] text-center text-neutral-500 dark:text-neutral-400">
                                        {color}
                                    </span>
                                </div>
                            );
                        })}
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
                        {sizes.map(size => {
                            const isSelected = filters.size?.includes(size) || false;
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const currentSizesFromUrl = searchParams.get('sizes')
                                            ? searchParams.get('sizes').split(',')
                                            : [];
                                        const newSizes = isSelected
                                            ? currentSizesFromUrl.filter(s => s !== size)
                                            : [...currentSizesFromUrl, size];

                                        // Update URL
                                        const params = new URLSearchParams(searchParams);
                                        if (newSizes.length > 0) {
                                            params.set('sizes', [...new Set(newSizes)].join(','));
                                        } else {
                                            params.delete('sizes');
                                        }
                                        setSearchParams(params, { replace: true });

                                        // Update parent component
                                        if (onFilterChange) {
                                            onFilterChange({
                                                target: {
                                                    name: 'size',
                                                    value: newSizes
                                                }
                                            });
                                        }
                                    }}
                                    className={`flex items-center justify-center w-10 h-10 text-sm rounded-full transition-all ${
                                        isSelected
                                            ? 'bg-black text-neutral-50'
                                            : `${isDay ? 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'} border ${isDay ? 'border-neutral-300' : 'border-neutral-600'}`
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className={`text-sm ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        No sizes available
                    </p>
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
                                name="min"
                                placeholder="From"
                                value={priceRange.min}
                                onChange={handlePriceChange}
                                onKeyDown={handlePriceKeyDown}
                                min="0"
                                step="0.01"
                                className={`dark:bg-neutral-800 w-full pl-8 pr-3 py-2 text-sm rounded focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent dark:focus:border-transparent ${
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
                                name="max"
                                placeholder="To"
                                value={priceRange.max}
                                onChange={handlePriceChange}
                                onKeyDown={handlePriceKeyDown}
                                min={priceRange.min || "0"}
                                step="0.01"
                                className={`dark:bg-neutral-800 w-full pl-8 pr-3 py-2 text-sm rounded focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent dark:focus:border-transparent ${
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