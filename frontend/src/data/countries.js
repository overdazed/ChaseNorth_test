// List of all countries with their ISO codes
export const countries = [
    { name: 'Austria', code: 'AT', shipping: 10.49 },
    { name: 'Belgium', code: 'BE', shipping: 10.49 },
    { name: 'Bulgaria', code: 'BG', shipping: 10.49 },
    { name: 'Croatia', code: 'HR', shipping: 10.49 },
    { name: 'Cyprus', code: 'CY', shipping: 10.49 },
    { name: 'Czech Republic', code: 'CZ', shipping: 10.49 },
    { name: 'Denmark', code: 'DK', shipping: 10.49 },
    { name: 'Estonia', code: 'EE', shipping: 10.49 },
    { name: 'Finland', code: 'FI', shipping: 10.49 },
    { name: 'France', code: 'FR', shipping: 10.49 },
    { name: 'Germany', code: 'DE', shipping: 5.12 },
    { name: 'Greece', code: 'GR', shipping: 10.49 },
    { name: 'Hungary', code: 'HU', shipping: 10.49 },
    { name: 'Italy', code: 'IT', shipping: 10.49 },
    { name: 'Latvia', code: 'LV', shipping: 10.49 },
    { name: 'Lithuania', code: 'LT', shipping: 10.49 },
    { name: 'Luxembourg', code: 'LU', shipping: 10.49 },
    { name: 'Malta', code: 'MT', shipping: 10.49 },
    { name: 'Netherlands', code: 'NL', shipping: 10.49 },
    { name: 'Poland', code: 'PL', shipping: 10.49 },
    { name: 'Portugal', code: 'PT', shipping: 10.49 },
    { name: 'Romania', code: 'RO', shipping: 10.49 },
    { name: 'Slovakia', code: 'SK', shipping: 10.49 },
    { name: 'Slovenia', code: 'SI', shipping: 10.49 },
    { name: 'Spain', code: 'ES', shipping: 10.49 },
    { name: 'Sweden', code: 'SE', shipping: 10.49 },
    { name: 'Switzerland', code: 'CH', shipping: 15.49 }
].sort((a, b) => a.name.localeCompare(b.name));

// Create a map for easy lookup
export const countryMap = countries.reduce((map, country) => {
    map[country.name.toLowerCase()] = country.code;
    return map;
}, {});

// Function to check if a country is valid
export const isValidCountry = (countryName) => {
    if (!countryName) return false;
    return countries.some(
        country => country.name.toLowerCase() === countryName.toLowerCase()
    );
};

// Function to get country suggestions
export const getCountrySuggestions = (input) => {
    if (!input || input.length < 2) return [];
    const searchTerm = input.toLowerCase();
    return countries
        .filter(country => 
            country.name.toLowerCase().includes(searchTerm) ||
            country.code.toLowerCase() === searchTerm
        )
        .map(country => country.name);
};
