import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {setFilters} from "@/redux/slices/productsSlice.js";

const FilterSidebar = ({
                           onFilterApply,
                           highestPrice = 0,
                           currentCategory,
                           products = [],
                           isDay = true,
                           onFilterChange,  // Add this
                           filters = { size: [] }     // Add default empty object
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
    
    // Color name to hex mapping
    const colorMap = {
        'tropical print': '#2E8B57',
        'navy palms': '#1A3A3F',
        'heather gray': '#B6B6B4',
        'heather grey': '#B6B6B4',
        'dark blue': '#00006c',
        'navy': '#000038',
        'blue': '#0000cb',
        'red': '#ab0000',
        'green': '#008000',
        'yellow': '#FFFF00',
        'gray': '#808080',
        'grey': '#808080',
        'orange': '#FFA500',
        'purple': '#800080',
        'pink': '#FFC0CB',
        'brown': '#A52A2A',
        'beige': '#F5F5DC',
        'maroon': '#800000',
        'teal': '#008080',
        'olive': '#808000',
        'lime': '#00FF00',
        'aqua': '#00FFFF',
        'royal blue': '#4169E1',
        'sky blue': '#87CEEB',
        'light blue': '#ADD8E6',
        'dark green': '#006400',
        'light green': '#90EE90',
        'forest green': '#228B22',
        'khaki': '#F0E68C',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32',
        'burgundy': '#800020',
        'indigo': '#4B0082',
        'violet': '#8F00FF',
        'lavender': '#E6E6FA',
        'mint': '#98FF98',
        'coral': '#FF7F50',
        'salmon': '#FA8072',
        'peach': '#FFDAB9',
        'mustard': '#FFDB58',
        'plum': '#DDA0DD',
        'magenta': '#FF00FF',
        'turquoise': '#40E0D0',
        'cyan': '#00FFFF',
        'charcoal': '#36454F',
        'taupe': '#483C32',
        'mauve': '#E0B0FF',
        'wine': '#722F37',
        'cream': '#FFFDD0',
        'off white': '#FAF9F6',
        'ivory': '#FFFFF0',
        'eggshell': '#F0EAD6',
        'champagne': '#F7E7CE',
        'blush': '#DE5D83',
        'rose gold': '#B76E79',
        'copper': '#B87333',
        'gunmetal': '#2A3439',
        'denim': '#1560BD',
        'cobalt': '#0047AB',
        'emerald': '#50C878',
        'jade': '#00A86B',
        'olive green': '#808000',
        'army green': '#4B5320',
        'camel': '#C19A6B',
        'tan': '#D2B48C',
        'beige': '#F5F5DC',
        'sand': '#F4A460',
        'taupe': '#8B8589',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'cocoa': '#D2691E',
        'chocolate': '#7B3F00',
        'caramel': '#D4A76A',
        'honey': '#F0E68C',
        'butter': '#F6E0A5',
        'vanilla': '#F3E5AB',
        'pearl': '#EAE0C8',
        'crystal': '#A7D8DE',
        'ice blue': '#99FFFF',
        'powder blue': '#B0E0E6',
        'baby blue': '#89CFF0',
        'royal blue': '#4169E1',
        'cobalt blue': '#0047AB',
        'sapphire': '#0F52BA',
        'teal': '#008080',
        'teal green': '#006D5B',
        'mint green': '#98FF98',
        'emerald green': '#50C878',
        'olive drab': '#6B8E23',
        'army green': '#4B5320',
        'hunter green': '#355E3B',
        'forest green': '#228B22',
        'kelly green': '#4CBB17',
        'lime green': '#32CD32',
        'neon green': '#39FF14',
        'olive': '#808000',
        'mustard yellow': '#FFDB58',
        'goldenrod': '#DAA520',
        'amber': '#FFBF00',
        'honey': '#F0E68C',
        'lemon': '#FFF44F',
        'canary': '#FFFF99',
        'banana': '#FFE135',
        'gold': '#FFD700',
        'rose gold': '#B76E79',
        'copper': '#B87333',
        'bronze': '#CD7F32',
        'rust': '#B7410E',
        'terracotta': '#E2725B',
        'coral': '#FF7F50',
        'salmon': '#FA8072',
        'peach': '#FFDAB9',
        'apricot': '#FBCEB1',
        'cantaloupe': '#FFA62F',
        'tangerine': '#F28500',
        'burnt orange': '#CC5500',
        'pumpkin': '#FF7518',
        'brick red': '#CB4154',
        'burgundy': '#800020',
        'maroon': '#800000',
        'wine': '#722F37',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'orchid': '#DA70D6',
        'lilac': '#C8A2C8',
        'lavender': '#E6E6FA',
        'periwinkle': '#CCCCFF',
        'mauve': '#E0B0FF',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA',
        'periwinkle': '#CCCCFF',
        'lavender': '#E6E6FA',
        'lilac': '#C8A2C8',
        'orchid': '#DA70D6',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA',
        'periwinkle': '#CCCCFF',
        'lavender': '#E6E6FA',
        'lilac': '#C8A2C8',
        'orchid': '#DA70D6',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA',
        'periwinkle': '#CCCCFF',
        'lavender': '#E6E6FA',
        'lilac': '#C8A2C8',
        'orchid': '#DA70D6',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA',
        'periwinkle': '#CCCCFF',
        'lavender': '#E6E6FA',
        'lilac': '#C8A2C8',
        'orchid': '#DA70D6',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA',
        'periwinkle': '#CCCCFF',
        'lavender': '#E6E6FA',
        'lilac': '#C8A2C8',
        'orchid': '#DA70D6',
        'plum': '#8E4585',
        'eggplant': '#614051',
        'grape': '#6F2DA8',
        'violet': '#8F00FF',
        'indigo': '#4B0082',
        'royal purple': '#7851A9',
        'amethyst': '#9966CC',
        'magenta': '#FF00FF',
        'fuchsia': '#FF00FF',
        'hot pink': '#FF69B4',
        'bubblegum': '#FFC1CC',
        'blush': '#DE5D83',
        'rose': '#FF007F',
        'ruby': '#E0115F',
        'cherry': '#D2042D',
        'crimson': '#DC143C',
        'scarlet': '#FF2400',
        'brick': '#8B0000',
        'mahogany': '#C04000',
        'chestnut': '#954535',
        'mocha': '#967969',
        'espresso': '#4E3524',
        'coffee': '#6F4E37',
        'cappuccino': '#4B3621',
        'caramel': '#D4A76A',
        'hazelnut': '#BDA55D',
        'almond': '#EFDECD',
        'peanut': '#7B3F00',
        'walnut': '#773F1A',
        'pecan': '#A0522D',
        'pistachio': '#93C572',
        'sage': '#9CAF88',
        'olive': '#808000',
        'moss': '#8A9A5B',
        'pine': '#01796F',
        'jade': '#00A86B',
        'emerald': '#50C878',
        'mint': '#98FF98',
        'seafoam': '#9FE2BF',
        'aqua': '#00FFFF',
        'turquoise': '#40E0D0',
        'teal': '#008080',
        'cobalt': '#0047AB',
        'navy': '#000080',
        'royal blue': '#4169E1',
        'sapphire': '#0F52BA'
    };

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
        } else if (name === 'size') {
            let newSizes = [...(filters.size || [])];
            if (newSizes.includes(value)) {
                newSizes = newSizes.filter(size => size !== value);
            } else {
                newSizes = [...newSizes, value];
            }

            if (newSizes.length > 0) {
                params.set('size', newSizes.join(','));
            } else {
                params.delete('size');
            }
            setSearchParams(params);
        }

        // Close the sidebar on mobile when a filter is applied
        if (onFilterApply && window.innerWidth < 1024) {
            onFilterApply();
        }
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
                        {colors.map(color => {
                            // Get the hex code from the color map, or use the color as-is if it's already a hex code
                            const colorValue = colorMap[color.toLowerCase()] || color;
                            return (
                                <div key={color} className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        name="color"
                                        value={color}
                                        onClick={handleFilterChange || onFilterChange}
                                        className={`w-6 h-6 rounded-full mb-1 ${
                                            filters.color === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''
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
                        {sizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                name="size"
                                value={size}
                                onClick={handleFilterChange || onFilterChange}
                                className={`flex items-center justify-center w-10 h-10 text-sm rounded-full transition-all ${
                                    (filters.size || []).includes(size)
                                        ? 'bg-black text-white'
                                        : `${isDay ? 'bg-white text-neutral-700 hover:bg-neutral-100' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'} border ${isDay ? 'border-neutral-300' : 'border-neutral-600'}`
                                }`}
                            >
                                {size}
                            </button>
                        ))}
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