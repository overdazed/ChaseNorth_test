// components/Products/FilterSidebar.jsx
import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange, currentFilters }) => {
    const [isOpen, setIsOpen] = useState({
        gender: true,
        category: true,
        size: true,
        price: true
    });

    const handleCheckboxChange = (type, value) => {
        const newFilters = { ...currentFilters };
        if (newFilters[type].includes(value)) {
            newFilters[type] = newFilters[type].filter(item => item !== value);
        } else {
            newFilters[type] = [...newFilters[type], value];
        }
        onFilterChange({ [type]: newFilters[type] });
    };

    const handlePriceChange = (min, max) => {
        onFilterChange({
            price: {
                min: Number(min),
                max: Number(max)
            }
        });
    };

    return (
        <div className="p-4">
            {/* Gender Filter */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => setIsOpen(prev => ({ ...prev, gender: !prev.gender }))}
                >
                    <h3 className="font-medium">Gender</h3>
                    <span>{isOpen.gender ? '−' : '+'}</span>
                </div>
                {isOpen.gender && (
                    <div className="space-y-2 pl-2">
                        {['Men', 'Women', 'Unisex'].map(gender => (
                            <label key={gender} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={currentFilters.gender.includes(gender)}
                                    onChange={() => handleCheckboxChange('gender', gender)}
                                    className="rounded"
                                />
                                <span>{gender}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => setIsOpen(prev => ({ ...prev, category: !prev.category }))}
                >
                    <h3 className="font-medium">Category</h3>
                    <span>{isOpen.category ? '−' : '+'}</span>
                </div>
                {isOpen.category && (
                    <div className="space-y-2 pl-2">
                        {['T-Shirts', 'Shirts', 'Pants', 'Shoes', 'Accessories'].map(category => (
                            <label key={category} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={currentFilters.category.includes(category)}
                                    onChange={() => handleCheckboxChange('category', category)}
                                    className="rounded"
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => setIsOpen(prev => ({ ...prev, size: !prev.size }))}
                >
                    <h3 className="font-medium">Size</h3>
                    <span>{isOpen.size ? '−' : '+'}</span>
                </div>
                {isOpen.size && (
                    <div className="grid grid-cols-3 gap-2 pl-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <label key={size} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={currentFilters.size.includes(size)}
                                    onChange={() => handleCheckboxChange('size', size)}
                                    className="rounded"
                                />
                                <span>{size}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range Filter */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => setIsOpen(prev => ({ ...prev, price: !prev.price }))}
                >
                    <h3 className="font-medium">Price Range</h3>
                    <span>{isOpen.price ? '−' : '+'}</span>
                </div>
                {isOpen.price && (
                    <div className="pl-2">
                        <div className="flex justify-between mb-2">
                            <span>${currentFilters.price.min}</span>
                            <span>${currentFilters.price.max}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={currentFilters.price.max}
                            onChange={(e) => handlePriceChange(0, e.target.value)}
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;