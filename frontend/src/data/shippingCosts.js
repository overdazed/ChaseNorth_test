// shippingCosts.js
import { countries } from './countries';

// Create a map of country names to shipping costs
export const shippingCosts = countries.reduce((acc, country) => {
    acc[country.name] = country.shipping;
    return acc;
}, {});

// Function to get shipping cost for a country
export const getShippingCost = (countryName) => {
    if (!countryName) return 0;
    return shippingCosts[countryName] || 10.49; // Default to 10.49 if country not found
};

export default shippingCosts;
