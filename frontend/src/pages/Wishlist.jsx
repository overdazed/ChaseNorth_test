import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import HeartIcon from '../components/ui/HeartIcon';
import { fetchProductDetails, updateWishlistCount } from '../redux/slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';

// Helper function to check if product is new (added within last 14 days)
const isProductNew = (createdAt) => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const diffTime = currentDate - createdDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
};

const CornerIcon = ({ className }) => (
    <>
      <img
          src="/src/assets/ChaseNorth_x-black.svg"
          alt=""
          className={`${className} w-6 h-6 dark:hidden`}
      />
      <img
          src="/src/assets/ChaseNorth_x-white.svg"
          alt=""
          className={`${className} w-6 h-6 hidden dark:block`}
      />
    </>
);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('bestSelling');
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const [filters, setFilters] = useState({
    color: '',
    size: [],
    category: '',
    gender: 'All'  // Set 'All' as default
  });

  // Theme state
  const [isDay, setIsDay] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      return !isDark;
    }
    return true;
  });

  // Update theme based on dark mode class
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDay(!isDark);
    };

    handleThemeChange();
    window.addEventListener('themeChange', handleThemeChange);

    // Close sidebar when clicking outside
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) &&
          !event.target.closest('button[onclick*="toggleSidebar"]')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.style.overflow = isSidebarOpen ? 'auto' : 'hidden';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Add this function to apply filters
  const applyFilters = (filters) => {
    console.log('--- FILTERS ---', filters);

    const filtered = products.filter(product => {
      console.log('Checking product:', {
        id: product._id,
        name: product.name,
        gender: product.gender,
        matchesFilter: filters.gender ?
            (filters.gender === 'All' ?
                    (product.gender === 'Men' || product.gender === 'Women') :
                    (product.gender === filters.gender)
            ) : true
      });

      // Filter by color
      if (filters.color && !product.colors?.includes(filters.color)) {
        return false;
      }

      // Filter by size
      if (filters.size && filters.size.length > 0 &&
          !filters.size.some(size => product.sizes?.includes(size))) {
        return false;
      }

      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Gender filter
      if (filters.gender) {
        if (filters.gender === 'All') {
          // Show both men's and women's products
          if (product.gender !== 'Men' && product.gender !== 'Women') {
            return false;
          }
        } else if (product.gender !== filters.gender) {
          return false;
        }
      }

      return true;
    });

    console.log('Filtered products count:', filtered.length);
    const sorted = sortProducts(filtered, sortBy);
    setFilteredProducts(sorted);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFilters(prev => {
      let newFilters;
      if (type === 'checkbox') {
        newFilters = {
          ...prev,
          [name]: checked
              ? [...(prev[name] || []), value]
              : (prev[name] || []).filter(item => item !== value)
        };
      } else {
        newFilters = {
          ...prev,
          [name]: value
        };
      }

      // Apply the filters immediately
      applyFilters(newFilters);
      return newFilters;
    });
  };

  useEffect(() => {
    applyFilters(filters);
  }, [sortBy]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters(filters);
    }
  }, [sortBy, products, filters]);

  // Sort products based on sortBy
  const sortProducts = (productsToSort, sortType) => {
    const sortedProducts = [...productsToSort];

    switch(sortType) {
      case 'featured':
        // Featured items first (you might want to add a 'featured' flag to your products)
        return [...sortedProducts].sort((a, b) =>
            (b.isFeatured || false) - (a.isFeatured || false) ||
            new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'bestSelling':
        // Sort by sales count (you'll need to add a 'salesCount' or similar field to your products)
        return [...sortedProducts].sort((a, b) =>
            (b.salesCount || 0) - (a.salesCount || 0)
        );
      case 'nameAsc':
        return [...sortedProducts].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
      case 'nameDesc':
        return [...sortedProducts].sort((a, b) =>
            b.name.localeCompare(a.name)
        );
      case 'priceAsc':
        return [...sortedProducts].sort((a, b) =>
            a.price - b.price
        );
      case 'priceDesc':
        return [...sortedProducts].sort((a, b) =>
            b.price - a.price
        );
      case 'dateOldNew':
        return [...sortedProducts].sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );
      case 'dateNewOld':
        return [...sortedProducts].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        // Default sort (featured first, then newest)
        return [...sortedProducts].sort((a, b) =>
            (b.isFeatured || false) - (a.isFeatured || false) ||
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  // useEffect(() => {
  //   const filtered = products.filter(product => {
  //     // Filter by color
  //     if (filters.color && !product.colors?.includes(filters.color)) {
  //       return false;
  //     }
  //
  //     // Filter by size
  //     if (filters.size.length > 0 && !filters.size.some(size =>
  //         product.sizes?.includes(size)
  //     )) {
  //       return false;
  //     }
  //
  //     // Filter by category
  //     if (filters.category && product.category !== filters.category) {
  //       return false;
  //     }
  //
  //     // Filter by gender
  //     if (filters.gender && product.gender !== filters.gender) {
  //       return false;
  //     }
  //
  //     return true;
  //   });
  //
  //   const sorted = sortProducts(filtered, sortBy);
  //   setFilteredProducts(sorted);
  // }, [products, filters, sortBy]);

  // Update filtered and sorted products when products or sortBy changes
  useEffect(() => {
    const sortedProducts = sortProducts(products, sortBy);
    setFilteredProducts(sortedProducts);
  }, [products, sortBy]);

  // Handle sort change from SortOptions
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  // Fetch product details for each item in wishlist
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        // Get user from Redux store
        const savedUser = localStorage.getItem('userInfo');
        const user = savedUser ? JSON.parse(savedUser) : null;
        
        // Use user-specific key for wishlist storage
        const wishlistKey = user ? `wishlist_${user._id}` : 'wishlist_guest';
        const saved = localStorage.getItem(wishlistKey);
        const items = saved ? JSON.parse(saved) : [];
        
        setWishlist(items);
        
        // Update Redux store with initial wishlist count
        dispatch(updateWishlistCount(items.length));

        if (items.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch product details for each item in wishlist
        const productPromises = items.map(async (id) => {
          try {
            const product = await dispatch(fetchProductDetails(id)).unwrap();
            return product;
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null; // Return null for failed fetches
          }
        });

        const productsData = await Promise.all(productPromises);
        // Filter out null values (failed fetches)
        const validProducts = productsData.filter(product => product !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error('Error in fetchWishlistProducts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchWishlistProducts();
    }
  }, [dispatch]);

  const removeFromWishlist = (productId) => {
    // Get user from Redux store or local storage
    const savedUser = localStorage.getItem('userInfo');
    const user = savedUser ? JSON.parse(savedUser) : null;
    
    // Use user-specific key for wishlist storage
    const wishlistKey = user ? `wishlist_${user._id}` : 'wishlist_guest';
    
    // Update local state
    const updatedWishlist = wishlist.filter(id => id !== productId);
    setWishlist(updatedWishlist);
    setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));

    // Update localStorage with user-specific key
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));

    // Update Redux store with new wishlist count
    dispatch(updateWishlistCount(updatedWishlist.length));
  };

  const handleProductClick = () => {
    // Save scroll position with current path as key
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    sessionStorage.setItem(`scrollPos:${location.pathname}`, scrollY);
  };

  if (loading) {
    return (
        <div className={`min-h-screen ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'}`}>
          <div className="container mx-auto px-4 py-8">
            <h2 className={`text-2xl uppercase mb-4 mt-20 ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
              YOUR WISHLIST
            </h2>
            <p className={`ml-2 mb-4 mt-16 ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>Loading...</p>
          </div>
        </div>
    );
  }

  return (
      <div className={`flex flex-col lg:flex-row pt-24 min-h-screen ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'}`}>
        {/* Filter Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full z-30 w-3/4 sm:w-1/2`}>
          <div className="absolute inset-0 bg-white"></div>
          <div ref={sidebarRef} className="relative h-full overflow-y-auto pt-[112px]">
            <FilterSidebar
                products={products}
                currentCategory={null}
                onFilterApply={toggleSidebar}
                isDay={isDay}
                onFilterChange={handleFilterChange}
                filters={filters}
            />
          </div>
        </div>

        <div className="flex-grow px-4 py-4 container mx-auto">
          <h2 className={`text-2xl uppercase mb-4 ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
            YOUR WISHLIST
          </h2>

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
            </div>
            <SortOptions onSortChange={setSortBy} currentSort={sortBy} />
          </div>
          {filteredProducts.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-[1600px] mx-auto px-4">
                  {filteredProducts.map((product, index) => (
                      <div
                          key={product._id}
                          className="border-[0.5px] border-black/10 hover:shadow-lg transition-all duration-300 bg-white relative w-full group dark:ring-[0.15px] dark:ring-neutral-50/80 dark:hover:ring-1 dark:hover:ring-neutral-50 dark:bg-neutral-900"
                      >
                        {/* Corner Icons - First product: top-left, Last product: bottom-right */}
                        {index === 0 && (
                            <CornerIcon className="absolute -top-3 -left-3 z-20" />
                        )}
                        {index === products.length - 1 && (
                            <CornerIcon className="absolute -bottom-3 -right-3 z-20" />
                        )}

                        <Link
                            to={`/product/${product._id}`}
                            onClick={handleProductClick}
                            className="block w-full relative overflow-hidden"
                        >
                          {/* Aspect ratio container - 4:5 */}
                          <div className="relative w-full aspect-[4/5] overflow-hidden">
                            {/* New Product Badge */}
                            {isProductNew(product.createdAt) && (
                                <img
                                    src="/new-star.svg"
                                    alt="New Arrival"
                                    className="absolute -top-2 -left-2 z-10 h-16 w-16 md:h-16 md:w-16"
                                />
                            )}

                            {/* Product Image with Contained Zoom */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div
                                  style={{
                                    backgroundImage: `url(${product.images?.[0]?.url || 'https://via.placeholder.com/400'})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute"
                                  }}
                                  className="transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                            </div>

                            {/* Product Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                              <div className="flex justify-between items-end">
                                <div>
                                  <h3 className="text-white font-medium text-sm">
                                    {product.name}
                                  </h3>
                                  <p className="text-white font-bold text-lg">
                                    ${product.price}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Heart Icon for removal */}
                        <div className="absolute top-2 right-2 z-10 w-8 h-8 md:w-6 md:h-6">
                          <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromWishlist(product._id);
                              }}
                              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                          >
                            <HeartIcon
                                productId={product._id}
                                className="w-full h-full text-red-500"
                                containerClass="w-full h-full"
                                isFilled={true}
                                noAnimation={true}
                            />
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 text-center max-w-2xl mx-auto">
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">Your wishlist is currently empty.</p>
                <Link
                    to="/collections/all"
                    className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors inline-block"
                >
                  Continue Shopping
                </Link>
              </div>
          )}
        </div>
      </div>
  );
};

export default Wishlist;
