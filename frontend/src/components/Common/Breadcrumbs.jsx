import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get('gender');
  const category = searchParams.get('category');
  const [isDarkMode, setIsDarkMode] = useState(
      typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Get the product from Redux if we're on a product page
  const product = useSelector((state) => {
    const productData = pathnames[0] === 'product' ? state.products?.selectedProduct : null;
    console.log('Product data in breadcrumb:', productData); // Debug log
    return productData;
  });

  const isProductPage = pathnames[0] === 'product' && pathnames[1];
  const productId = pathnames[1];

  // Debug logs
  console.log('Current pathnames:', pathnames);
  console.log('Is product page:', isProductPage);
  console.log('Product ID from URL:', productId);
  console.log('Product from Redux:', product);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e) => {
      const isDark = e.detail?.isDarkMode ??
          document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    handleThemeChange({});
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  // Display names mapping
  const displayNames = {
    'collections': 'Collections',
    'men': 'Men',
    'women': 'Women',
    'new-arrivals': 'New Arrivals',
    'sale': 'Sale',
    'accessories': 'Accessories',
    'shoes': 'Shoes',
    'clothing': 'Clothing',
    'top-wear': 'Top Wear',
    'bottom-wear': 'Bottom Wear',
    'faq': 'FAQs',
    'product': 'Product',
  };

  // Special handling for category pages
  if (location.pathname.startsWith('/collections/')) {
    let category_path = pathnames[1];

    if (category_path === 'all') {
      if (gender) {
        category_path = gender.toLowerCase();
      } else if (category) {
        category_path = category.toLowerCase().replace(/ /g, '-');
      }
    }

    const showLastPart = !(category_path === 'all' && !gender && !category);

    return (
        <div className={`${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
          <nav className="text-sm py-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <ol className="flex items-center space-x-1 md:space-x-2">
              <li>
                <Link to="/" className={`${
                    isDarkMode
                        ? 'text-neutral-400 hover:text-neutral-200'
                        : 'text-neutral-500 hover:text-neutral-700'
                } transition-colors`}>
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className={`h-4 w-4 mx-1 ${
                    isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
                }`} />
                <Link
                    to="/collections/all"
                    className={`${location.pathname === '/collections/all' && !gender && !category
                        ? isDarkMode ? 'text-neutral-200' : 'text-neutral-700 font-medium'
                        : isDarkMode
                            ? 'text-neutral-400 hover:text-neutral-200'
                            : 'text-neutral-500 hover:text-neutral-700'
                    } transition-colors`}
                >
                  Collections
                </Link>
              </li>
              {showLastPart && (
                  <li className="flex items-center">
                    <ChevronRight className={`h-4 w-4 mx-1 ${
                        isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
                    }`} />
                    <span className={`font-medium ${
                        isDarkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}>
                    {displayNames[category_path] || category_path.split('-').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                  </li>
              )}
            </ol>
          </nav>
        </div>
    );
  }

  // Default breadcrumb generation for other pages
  return (
      <div className={`${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
        <nav className={`text-sm py-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full ${
            isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
        }`}>
          <ol className="flex items-center space-x-1 md:space-x-2">
            <li>
              <Link to="/" className={`${
                  isDarkMode
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-500 hover:text-neutral-700'
              } transition-colors`}>
                Home
              </Link>
            </li>
            
            {/* Show Collections and collection name for product pages */}
            {isProductPage && product?.gender && (
              <>
                <li className="flex items-center">
                  <ChevronRight className={`h-4 w-4 mx-1 ${
                    isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
                  }`} />
                  <Link 
                    to="/collections/all"
                    className={`${
                      isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-700'
                    } transition-colors`}
                  >
                    Collections
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className={`h-4 w-4 mx-1 ${
                    isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
                  }`} />
                  <Link 
                    to={`/collections/all?gender=${product.gender.toLowerCase()}`}
                    className={`${
                      isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-700'
                    } transition-colors`}
                  >
                    {product.gender}
                  </Link>
                </li>
              </>
            )}
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const isProductId = pathnames[0] === 'product' && index === 1;
              const isOrderId = pathnames[0] === 'order' && index === 1;

              // Skip the 'order' breadcrumb if it's not the last item
              if (pathnames[0] === 'order' && index === 0) {
                return null;
              }

              // For product pages, use the product name if available
              let displayName;
              if (isProductId) {
                console.log('Setting display name for product. Name:', product?.name, 'ID:', name); // Debug log
                displayName = product?.name || name;
              } else {
                displayName = displayNames[name.toLowerCase()] ||
                    name.split('-').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
              }

              return (
                <li key={`${name}-${index}`} className="flex items-center">
                  <ChevronRight className={`h-4 w-4 mx-1 ${
                      isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
                  }`} />
                  {isLast ? (
                    <span className={`font-medium ${
                        isDarkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}>
                      {displayName}
                    </span>
                  ) : (
                    <Link
                      to={isOrderId ? '/my-orders' : routeTo}
                      className={`${
                          isDarkMode
                              ? 'text-neutral-400 hover:text-neutral-200'
                              : 'text-neutral-500 hover:text-neutral-700'
                      } transition-colors`}
                    >
                      {displayName}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
  );
};

export default Breadcrumbs;