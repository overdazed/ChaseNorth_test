import { useState, useEffect, useRef } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import * as queryString from "node:querystring";
import FilterSidebar from "../components/Products/FilterSidebar.jsx";
import SortOptions from "../components/Products/SortOptions.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import SwipeCards from "../components/Products/SwipeCards.jsx";
import { fetchProductsByFilters, setFilters } from "../redux/slices/productsSlice.js";

const CollectionPage = () => {
    // Theme state
    const [isDay, setIsDay] = useState(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            return !isDark;
        }
        return true;
    });

    // To get the collection name
    const { collection } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const { products, loading, error, filters } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [highestPrice, setHighestPrice] = useState(0);

    const gender = searchParams.get('gender') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        setPriceRange({
            min: minPrice || '',
            max: maxPrice || ''
        });
    }, [searchParams]);

    // Update theme based on dark mode class
    useEffect(() => {
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDay(!isDark);
        };

        handleThemeChange();
        window.addEventListener('themeChange', handleThemeChange);

        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    // Sort state and function
    const [sortBy, setSortBy] = useState('bestSelling');

    // Sort products function
    const sortProducts = (productsToSort, sortType) => {
        if (!productsToSort) return [];
        const sortedProducts = [...productsToSort];

        switch(sortType) {
            case 'featured':
                return [...sortedProducts].sort((a, b) =>
                    (b.isFeatured || false) - (a.isFeatured || false) ||
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            case 'bestSelling':
                return [...sortedProducts].sort((a, b) =>
                    (b.salesCount || 0) - (a.salesCount || 0)
                );
            case 'nameAsc':
                return [...sortedProducts].sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '')
                );
            case 'nameDesc':
                return [...sortedProducts].sort((a, b) =>
                    (b.name || '').localeCompare(a.name || '')
                );
            case 'priceAsc':
                return [...sortedProducts].sort((a, b) =>
                    (a.price || 0) - (b.price || 0)
                );
            case 'priceDesc':
                return [...sortedProducts].sort((a, b) =>
                    (b.price || 0) - (a.price || 0)
                );
            case 'dateOldNew':
                return [...sortedProducts].sort((a, b) =>
                    new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
                );
            case 'dateNewOld':
            default:
                return [...sortedProducts].sort((a, b) =>
                    (b.isFeatured || false) - (a.isFeatured || false) ||
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
        }
    };

    // Get sorted products
    const sortedProducts = sortProducts(products, sortBy);

    // click on filter, drawer comes from side, click anywhere else, close drawer
    const sidebarRef = useRef(null);

    // Price filter state
    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: ''
    });
    const priceFilterRef = useRef(null);
    
    // Close price filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (priceFilterRef.current && !priceFilterRef.current.contains(event.target)) {
                setIsPriceFilterOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Apply price filter
    const applyPriceFilter = () => {
        const params = new URLSearchParams(location.search);

        // Convert to numbers without toFixed to keep them as numbers
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
        setIsPriceFilterOpen(false);
    };

    useEffect(() => {
        if (products && products.length > 0) {
            const maxPrice = Math.max(...products.map(p => p.price));
            setHighestPrice(maxPrice);
        }
    }, [products]);
    
    // Clear price filter
    const clearPriceFilter = () => {
        setPriceRange({ min: '', max: '' });
        const params = new URLSearchParams(location.search);
        params.delete('minPrice');
        params.delete('maxPrice');
        setSearchParams(params);
    };

    const handlePriceKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    };

    useEffect(() => {
        const params = {
            collection,
            ...queryParams,
            sortBy: queryParams.sortBy || 'bestSelling',
            limit: queryParams.limit, // Add default limit
            ...(queryParams.gender && { gender: queryParams.gender }),
            ...(queryParams.sizes && { sizes: queryParams.sizes }),
            ...(queryParams.colors && { colors: queryParams.colors })
        };

        // Add the debug log here
        console.log('Price range filter:', {
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            query: JSON.stringify(params),
            collection: collection || 'all'
        });


        // Ensure minPrice and maxPrice are numbers
        if (queryParams.minPrice) {
            params.minPrice = Number(queryParams.minPrice);
        }
        if (queryParams.maxPrice) {
            params.maxPrice = Number(queryParams.maxPrice);
        }

        dispatch(fetchProductsByFilters(params));
        setSortBy(params.sortBy || 'bestSelling');
    }, [dispatch, collection, searchParams]);

    const toggleSidebar = (e) => {
        // Stop event propagation to prevent triggering click-outside handler
        if (e) {
            e.stopPropagation();
        }
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleClickOutside = (e) => {
        // Only handle clicks if sidebar is open
        if (!isSidebarOpen) return;

        // Check if the click is on the apply button
        const isApplyButton = e.target.closest('button')?.textContent?.trim() === 'Apply';

        // Check if the click is on a filter input, label, or inside the sidebar
        const isFilterElement = e.target.closest('.filter-options, input, label, select, .price-range, .price-inputs');

        // Don't close if clicking on filter elements or apply button
        if (isFilterElement && !isApplyButton) {
            return;
        }

        // Close the sidebar if clicking outside of it
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener to detect clicks outside the sidebar
        document.addEventListener("mousedown", handleClickOutside);
        // clean up the event listener by removing it on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isSidebarOpen]) // Add isSidebarOpen to the dependency array


    // to populate the products
    // useEffect(() => {
    //     // fetch the products from the backend
    //     // simulate the fetching of products
    //     setTimeout(() => {
    //         // set the products to the state variable
    //         const fetchedProducts = [
    //             {
    //                 _id: "1",
    //                 name: "Product 1",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=1",
    //                         altText: "Product 1",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "2",
    //                 name: "Product 2",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=2",
    //                         altText: "Product 2",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "3",
    //                 name: "Product 3",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=3",
    //                         altText: "Product 3",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "4",
    //                 name: "Product 4",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=4",
    //                         altText: "Product 4",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "5",
    //                 name: "Product 5",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=5",
    //                         altText: "Product 5",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "6",
    //                 name: "Product 6",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=6",
    //                         altText: "Product 6",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "7",
    //                 name: "Product 7",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=7",
    //                         altText: "Product 7",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "8",
    //                 name: "Product 8",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=8",
    //                         altText: "Product 8",
    //                     },
    //                 ]
    //             }
    //         ];
    //         setProducts(fetchedProducts);
    //     }, 1000);
    // }, []);

    const bgClass = isDay ? 'bg-neutral-50' : 'bg-neutral-950';

    return (
        <div className={bgClass}>
            <div className="flex flex-col lg:flex-row pt-24 min-h-screen">
                {/* Mobile Filter */}
                {/*<button
                    onClick={toggleSidebar}
                    className="lg:hidden border p-2 flex justify-center items-center">
                    <FaFilter className="mr-2" /> Filters
                </button>*/}

                {/* Filter Sidebar */}
                <div className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 h-full z-30 w-3/4 sm:w-1/2`}>
                    <div className="absolute inset-0 bg-neutral-50"></div>
                    <div ref={sidebarRef} className="relative h-full overflow-y-auto pt-[112px]">
                        <div className="relative z-40">
                            <FilterSidebar
                                key={collection}
                                highestPrice={highestPrice}
                                currentCategory={collection}
                                products={products}
                                onFilterApply={toggleSidebar}
                                isDay={isDay}
                                onFilterChange={(e) => {
                                    // Skip brand changes as they're handled internally
                                    if (e.target.name === 'brand') return;

                                    const { name, value, type, checked } = e.target;

                                    // Handle different input types
                                    if (type === 'checkbox') {
                                        const currentValues = filters[name] || [];
                                        let newValues;

                                        if (checked) {
                                            newValues = [...currentValues, value];
                                        } else {
                                            newValues = currentValues.filter(v => v !== value);
                                        }

                                        dispatch(setFilters({ ...filters, [name]: newValues }));
                                    } else if (type === 'radio') {
                                        // For radio buttons, just set the value
                                        dispatch(setFilters({ ...filters, [name]: value }));
                                    } else {
                                        // For other input types (text, number, etc.)
                                        dispatch(setFilters({ ...filters, [name]: value }));
                                    }
                                }}
                                filters={filters}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-grow px-4 pt-0 pb-4 container mx-auto">  {/* Changed pt-2 to pt-0 to remove top padding */}
                    {gender.toUpperCase() === 'MEN' ? (
                        <div>
                            <h1 className={`text-3xl font-medium mb-2 -mt-20 uppercase ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                Men
                            </h1>
                            <p className={`text-sm ${isDay ? 'text-neutral-600' : 'text-neutral-400'} mb-4`}>
                                Discover our men's collection
                            </p>
                        </div>
                    ) : gender.toUpperCase() === 'WOMEN' ? (
                        <div>
                            <h1 className={`text-3xl font-medium mb-2 -mt-20 uppercase ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                Women
                            </h1>
                            <p className={`text-sm ${isDay ? 'text-neutral-600' : 'text-neutral-400'} mb-4`}>
                                Explore our women's collection
                            </p>
                        </div>
                    ) : category.toLowerCase().includes('top') ? (
                        <div>
                            <h1 className={`text-3xl font-medium mb-2 -mt-20 uppercase ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                Top Wear
                            </h1>
                            <p className={`text-sm ${isDay ? 'text-neutral-600' : 'text-neutral-400'} mb-4`}>
                                Browse our top wear selection
                            </p>
                        </div>
                    ) : category.toLowerCase().includes('bottom') ? (
                        <div>
                            <h1 className={`text-3xl font-medium mb-2 -mt-20 uppercase ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                Bottom Wear
                            </h1>
                            <p className={`text-sm ${isDay ? 'text-neutral-600' : 'text-neutral-400'} mb-4`}>
                                Find your perfect bottom wear
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2 className={`text-3xl uppercase mb-2 -mt-20 ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                All Collection
                            </h2>
                            <p className={`text-sm ${isDay ? 'text-neutral-600' : 'text-neutral-400'} mb-4`}>
                                Browse our complete collection
                            </p>
                        </div>
                    )}

                    {/* Filter and Sort Controls */}
                    <div className="flex justify-between items-baseline mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSidebar}
                                className={`flex items-center h-[38px] rounded-md px-3 text-sm ${
                                    isDay
                                        ? 'text-neutral-600 bg-neutral-50 hover:bg-neutral-50'
                                        : 'text-neutral-400 bg-neutral-900 hover:bg-neutral-800'
                                }`}
                            >
                                <FaFilter size={14} className="mr-2" />
                                <span>Filters</span>
                            </button>
                            
                            {/* Price Filter Button */}
                            <div className="relative hidden md:block" ref={priceFilterRef}>
                                <button
                                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                                    className={`flex items-center h-[38px] rounded-md px-3 text-sm ${
                                        isDay
                                            ? 'text-neutral-600 bg-neutral-50 hover:bg-neutral-100'
                                            : 'text-neutral-400 bg-neutral-950 hover:bg-neutral-900'
                                    }`}
                                >
                                    <span>Price</span>
                                    <FaChevronDown className="ml-1" size={12} />
                                </button>

                                {/* Price Filter Dropdown */}
                                {isPriceFilterOpen && (
                                    <div className={`absolute left-0 mt-1 w-64 p-4 rounded-md shadow-lg z-40 ${
                                        isDay ? 'bg-neutral-50' : 'bg-neutral-800'
                                    }`}>
                                        <div className="space-y-3">
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                                The highest price is {highestPrice.toFixed(2)} €
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="relative flex-1">
                                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>€</span>
                                                    <input
                                                        type="number"
                                                        placeholder="From"
                                                        value={priceRange.min}
                                                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                                        onKeyDown={handlePriceKeyDown}
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full pl-8 pr-3 py-2 text-sm rounded appearance-none ${
                                                            isDay
                                                                ? 'bg-neutral-50'
                                                                : 'bg-neutral-900 text-neutral-50'
                                                        }`}
                                                        onWheel={(e) => e.target.blur()}
                                                    />
                                                </div>
                                                <span className="text-neutral-400">-</span>
                                                <div className="relative flex-1">
                                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDay ? 'text-neutral-500' : 'text-neutral-400'}`}>€</span>
                                                    <input
                                                        type="number"
                                                        placeholder="To"
                                                        value={priceRange.max}
                                                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                                        onKeyDown={handlePriceKeyDown}
                                                        min={priceRange.min || "0"}
                                                        step="0.01"
                                                        className={`w-full pl-8 pr-3 py-2 text-sm rounded appearance-none ${
                                                            isDay
                                                                ? 'bg-neutral-50'
                                                                : 'bg-neutral-900 text-neutral-50'
                                                        }`}
                                                        onWheel={(e) => e.target.blur()}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <button
                                                    onClick={clearPriceFilter}
                                                    className="text-sm text-neutral-400 hover:text-neutral-950 hover:underline"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={applyPriceFilter}
                                                    className="px-5 py-2 text-sm rounded-full bg-black text-neutral-50 hover:bg-neutral-900"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <SortOptions
                            onSortChange={(sortBy) => {
                                setSortBy(sortBy);
                                const params = new URLSearchParams(location.search);
                                if (sortBy && sortBy !== 'bestSelling') {
                                    params.set('sortBy', sortBy);
                                } else {
                                    params.delete('sortBy');
                                }
                                setSearchParams(params);
                            }}
                            currentSort={sortBy}
                        />
                    </div>

                    {products.length > 0 && (
                        <>
                            {/* First two rows of products (6 products total) */}
                            {products.length > 6 ? (
                                <ProductGrid
                                    products={sortedProducts.slice(0, 12)}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            ) : (
                                <ProductGrid
                                    products={sortedProducts}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            )}

                            {/* SwipeCards section - only show if there are more than 6 products */}
                            {products.length > 6 && (
                                <div className="mt-12 mb-12">
                                    <SwipeCards products={sortedProducts} />
                                </div>
                            )}

                            {/* Show remaining products if there are more than 12 */}
                            {products.length > 12 && (
                                <ProductGrid
                                    products={sortedProducts.slice(12)}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            )}
                        </>
                    )}

                    {/* Show loading or error state */}
                    {!loading && products.length === 0 && !error && (
                        <div className="text-center py-12">
                            <p className={isDay ? 'text-neutral-700' : 'text-neutral-400'}>
                                No products found in this collection.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CollectionPage;

// route in App.jsx

// for testing update the main link in Navbar