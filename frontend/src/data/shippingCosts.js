// shippingCosts.js
import { countries } from './countries';

// Create a map of country names to shipping costs
export const shippingCosts = countries.reduce((acc, country) => {
    acc[country.name] = country.shipping;
    return acc;
}, {});

// Function to get shipping cost for a country
export const getShippingCost = (countryName, subtotal = 0) => {
    if (!countryName) return 0;
    
    // Free shipping for orders over $100
    if (subtotal >= 100) {
        return 0;
    }
    
    return shippingCosts[countryName] || 10.49; // Default to 10.49 if country not found
};

export default shippingCosts;
