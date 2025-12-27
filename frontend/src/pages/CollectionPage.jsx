import { useState, useEffect, useRef } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import * as queryString from "node:querystring";
import FilterSidebar from "../components/Products/FilterSidebar.jsx";
import SortOptions from "../components/Products/SortOptions.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import SwipeCards from "../components/Products/SwipeCards.jsx";
import { fetchProductsByFilters } from "../redux/slices/productsSlice.js";

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
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);

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

    // state variable to determine if the drawer is open or closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
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

        // Validate and set min price
        if (priceRange.min && !isNaN(priceRange.min) && priceRange.min >= 0) {
            params.set('minPrice', priceRange.min);
        } else {
            params.delete('minPrice');
        }

        // Validate and set max price
        if (priceRange.max && !isNaN(priceRange.max) && priceRange.max >= 0) {
            params.set('maxPrice', priceRange.max);
        } else {
            params.delete('maxPrice');
        }

        // Validate that min is less than max if both are set
        if (params.has('minPrice') && params.has('maxPrice') &&
            Number(params.get('minPrice')) > Number(params.get('maxPrice'))) {
            // Swap values if min is greater than max
            const temp = params.get('minPrice');
            params.set('minPrice', params.get('maxPrice'));
            params.set('maxPrice', temp);
        }

        setSearchParams(params);
        setIsPriceFilterOpen(false);
    };
    
    // Clear price filter
    const clearPriceFilter = () => {
        setPriceRange({ min: '', max: '' });
        const params = new URLSearchParams(location.search);
        params.delete('minPrice');
        params.delete('maxPrice');
        setSearchParams(params);
    };

    useEffect(() => {
        const params = {
            collection,
            ...queryParams,
            sortBy: queryParams.sortBy || 'bestSelling'
        };

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

        // Check if the click is outside the sidebar and not on the filter button
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            const filterButton = e.target.closest('button');
            if (!filterButton || !filterButton.contains(e.target)) {
                setIsSidebarOpen(false);
            }
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
                    <div className="absolute inset-0 bg-white"></div>
                    <div ref={sidebarRef} className="relative h-full overflow-y-auto pt-[112px]">
                        <FilterSidebar />
                    </div>
                </div>

                <div className="flex-grow px-4 py-4 container mx-auto">
                    <h2 className={`text-2xl uppercase mb-4 ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                        All Collection
                    </h2>

                    {/* Filter and Sort Controls */}
                    <div className="flex justify-between items-baseline mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSidebar}
                                className={`flex items-center h-[38px] border rounded-md px-3 text-sm ${
                                    isDay
                                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        : 'border-gray-700 text-neutral-50 bg-neutral-900 hover:bg-neutral-800'
                                }`}
                            >
                                <FaFilter size={14} className="mr-2" />
                                <span>Filters</span>
                            </button>
                            
                            {/* Price Filter Button */}
                            <div className="relative" ref={priceFilterRef}>
                                <button
                                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                                    className={`flex items-center h-[38px] border rounded-md px-3 text-sm ${
                                        isDay
                                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                            : 'border-gray-700 text-neutral-50 bg-neutral-900 hover:bg-neutral-800'
                                    }`}
                                >
                                    <span>Price</span>
                                    <FaChevronDown size={12} className="ml-2" />
                                </button>
                                
                                {/* Price Filter Dropdown */}
                                {isPriceFilterOpen && (
                                    <div className={`absolute left-0 mt-1 w-64 p-4 rounded-md shadow-lg z-40 ${
                                        isDay ? 'bg-neutral-50' : 'bg-neutral-800'
                                    }`}>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    placeholder="From"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                                    min="0"
                                                    step="0.01"
                                                    className={`w-full p-2 text-sm rounded ${
                                                        isDay
                                                            ? 'bg-neutral-50'
                                                            : 'bg-neutral-900 text-neutral-50'
                                                    }`}
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    placeholder="To"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                                    min={priceRange.min || "0"}
                                                    step="0.01"
                                                    className={`w-full p-2 text-sm rounded ${
                                                        isDay
                                                            ? 'bg-neutral-50'
                                                            : 'bg-neutral-900 text-neutral-50'
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <button
                                                    onClick={clearPriceFilter}
                                                    className="text-md text-neutral-950 hover:text-gray-700"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={applyPriceFilter}
                                                    className="px-5 py-2 text-sm rounded-full bg-black text-white hover:bg-gray-800"
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
                            {products.length > 12 && (
                                <ProductGrid
                                    products={sortedProducts.slice(0, 12)}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            )}

                            {/* Show all products if 6 or fewer */}
                            {products.length > 0 && products.length <= 6 && (
                                <ProductGrid
                                    products={sortedProducts}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            )}

                            {/* SwipeCards section */}
                            {products.length > 12 && (
                                <div className="mt-12 mb-12">
                                    {/*<h3 className={`text-xl text-center font-medium mb-4 ${isDay ? 'text-gray-900' : 'text-white'}`}>*/}
                                    {/*    Featured Picks*/}
                                    {/*</h3>*/}
                                    <SwipeCards products={sortedProducts} />
                                </div>
                            )}

                            {/* Remaining products after first two rows */}
                            {products.length > 12 && (
                                <ProductGrid
                                    products={sortedProducts.slice(12)}
                                    loading={loading}
                                    error={error}
                                    isDay={isDay}
                                    newStarBadgeSize="md"
                                />
                            )}

                            {/* If 6 or fewer products, show SwipeCards after all products */}
                            {products.length > 0 && products.length <= 6 && (
                                <div className="mt-4 mb-8">
                                    <h3 className={`text-xl text-center font-medium mb-8 ${isDay ? 'text-gray-900' : 'text-white'}`}>
                                        Featured Picks
                                    </h3>
                                    <SwipeCards products={sortedProducts} />
                                </div>
                            )}
                        </>
                    )}

                    {/* Show loading or error state */}
                    {!loading && products.length === 0 && !error && (
                        <div className="text-center py-12">
                            <p className={isDay ? 'text-gray-700' : 'text-gray-400'}>
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