const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// List of all route files to test
const routeFiles = [
    'userRoutes',
    'productRoutes',
    'cartRoutes',
    'checkoutRoutes',
    'orderRoutes',
    'uploadRoutes',
    'subscribeRoute',
    'adminRoutes',
    'productAdminRoutes',
    'adminOrderRoutes',
    'productReviews'
];

// Test each route file one by one
routeFiles.forEach((routeFile, index) => {
    try {
        const route = require(`./routes/${routeFile}`);
        app.use(`/api/test-${index}`, route);
        console.log(`✅ Successfully loaded: ${routeFile}`);
        
        // Add a test route for this specific route file
        app.get(`/api/test-${index}/test`, (req, res) => {
            res.json({ message: `Test route for ${routeFile} is working!` });
        });
    } catch (error) {
        console.error(`❌ Error loading ${routeFile}:`, error.message);
    }
});

// Basic test route
app.get('/', (req, res) => {
    res.send('Test server is running. Check console for route loading status.');
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`\nTest server running on port ${PORT}`);
    console.log('Testing route files...\n');
});
