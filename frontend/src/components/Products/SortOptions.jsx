import { useSearchParams, useLocation } from "react-router-dom";

const SortOptions = ({ onSortChange, currentSort = '' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Handle sort change
    const handleSortChange = (e) => {
        const sortBy = e.target.value;

        if (onSortChange) {
            // For Wishlist (uses callback)
            onSortChange(sortBy);
        } else {
            // For CollectionPage (updates URL)
            const params = new URLSearchParams(location.search);
            if (sortBy) {
                params.set('sortBy', sortBy);
            } else {
                params.delete('sortBy');
            }
            setSearchParams(params);
        }
    };

    // Get the current sort value
    const sortValue = currentSort || searchParams.get('sortBy') || '';

    return (
        <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort By:</span>
                <select
                    id="sort"
                    onChange={handleSortChange}
                    value={sortValue}
                    className="p-2 rounded-md text-md text-gray-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                    <option value="featured">Featured</option>
                    <option value="bestSelling">Best Selling</option>
                    <option value="nameAsc">Alphabetically, A-Z</option>
                    <option value="nameDesc">Alphabetically, Z-A</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="dateOldNew">Date: Old to New</option>
                    <option value="dateNewOld">Date: New to Old</option>
                </select>
            </div>
        </div>
    )
}
export default SortOptions

// include in CollectionPage.jsx