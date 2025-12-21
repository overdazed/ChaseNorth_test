import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get('gender');
  const category = searchParams.get('category');

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  // Map of URL segments to display names
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
    // Add more mappings as needed
  };

  // Special handling for category pages
  if (location.pathname.startsWith('/collections/')) {
    let category_path = pathnames[1]; // Get the category part (men, women, etc.)
    
    // If we're on /collections/all with a gender filter, use that instead of 'all'
    if (category_path === 'all') {
      if (gender) {
        category_path = gender.toLowerCase();
      } else if (category) {
        category_path = category.toLowerCase();
      }
    }

    return (
        <nav className="text-sm py-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <ol className="flex items-center space-x-1 md:space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              <Link
                  to="/collections"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Collections
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
              {displayNames[category_path] || category.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
            </li>
          </ol>
        </nav>
    );
  }

  // Default breadcrumb generation for other pages
  return (
      <nav className="text-sm py-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ol className="flex items-center space-x-1 md:space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              Home
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = displayNames[name.toLowerCase()] ||
                name.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

            return (
                <li key={name} className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  {isLast ? (
                      <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {displayName}
                </span>
                  ) : (
                      <Link
                          to={routeTo}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {displayName}
                      </Link>
                  )}
                </li>
            );
          })}
        </ol>
      </nav>
  );
};

export default Breadcrumbs;