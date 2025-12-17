import React from 'react';

const PartialStarRating = ({ rating, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };
    
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    
    // Calculate fill percentage for each star (0-100%)
    const getStarFill = (starIndex) => {
        const starValue = rating - starIndex;
        if (starValue >= 1) return 100;  // Fully filled
        if (starValue <= 0) return 0;    // Empty
        
        // For partial stars, calculate the exact percentage (25%, 50%, 75%)
        const decimalPart = starValue % 1;
        if (decimalPart <= 0.25) return 0;    // Less than 25% counts as empty
        if (decimalPart <= 0.5) return 50;    // 25-50% shows as half
        if (decimalPart <= 0.75) return 75;   // 50-75% shows as three-quarters
        return 100;                           // 75-99% shows as full
    };

    return (
        <div className="flex">
            {[0, 1, 2, 3, 4].map((starIndex) => {
                const fillPercentage = getStarFill(starIndex);
                
                return (
                    <div key={starIndex} className="relative inline-block">
                        {/* Gray background star */}
                        <svg 
                            className={`${sizeClass} text-gray-300 dark:text-gray-600`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 22 20"
                            fill="currentColor"
                        >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                        </svg>
                        
                        {/* Yellow fill star */}
                        {fillPercentage > 0 && (
                            <div 
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${fillPercentage}%` }}
                            >
                                <svg 
                                    className={`${sizeClass} text-yellow-400`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 22 20"
                                    fill="currentColor"
                                >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PartialStarRating;
