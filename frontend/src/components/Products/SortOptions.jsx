import { useState, useRef, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

const SortOptions = ({ onSortChange, currentSort = '' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle sort change
    const handleSortChange = (sortBy) => {
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
        setIsOpen(false);
    };

    // Get the current sort value
    const sortValue = currentSort || searchParams.get('sortBy') || '';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "bestSelling", label: "Best Selling" },
        { value: "nameAsc", label: "Alphabetically, A-Z" },
        { value: "nameDesc", label: "Alphabetically, Z-A" },
        { value: "priceAsc", label: "Price: Low to High" },
        { value: "priceDesc", label: "Price: High to Low" },
        { value: "dateOldNew", label: "Date: Old to New" },
        { value: "dateNewOld", label: "Date: New to Old" }
    ];

    const selectedOption = sortOptions.find(option => option.value === sortValue) || sortOptions[0];

    return (
        <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2" ref={dropdownRef}>
                <span className="text-sm text-neutral-600">Sort By:</span>
                <div className="relative inline-block text-left">
                    <div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex justify-between items-center w-full h-[38px] rounded-md px-3 py-2 bg-neutral-50 dark:bg-neutral-950 text-sm font-normal text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent dark:focus:border-transparent"
                            id="options-menu"
                            aria-haspopup="true"
                            aria-expanded="true"
                        >
                            {selectedOption.label}
                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {isOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50" onClick={(e) => e.stopPropagation()}>
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`w-full text-left block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:bg-opacity-10 dark:hover:bg-accent dark:hover:bg-opacity-40 hover:text-neutral-900 dark:hover:text-neutral-50 ${sortValue === option.value ? 'bg-accent bg-opacity-30 dark:bg-accent' : ''}`}
                                        role="menuitem"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default SortOptions

// include in CollectionPage.jsx