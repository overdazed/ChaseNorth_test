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
                    className="border p-2 rounded-md focus:outline-none text-sm"
                >
                    <option value="">Default</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                </select>
            </div>
        </div>
    )
}
export default SortOptions

// include in CollectionPage.jsx