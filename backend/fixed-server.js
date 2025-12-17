const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS with credentials support
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS with the above options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Basic test route is working!' });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
        
        // Import and use routes after successful connection
        await useRoutes();
        
        // Start the server
        const PORT = process.env.PORT || 9000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Function to use routes
const useRoutes = async () => {
    console.log('Loading routes...');
    
    // Import routes
    const routes = [
        { path: '/api/users', route: require('./routes/userRoutes') },
        { path: '/api/products', route: require('./routes/productRoutes') },
        { path: '/api/cart', route: require('./routes/cartRoutes') },
        { path: '/api/checkout', route: require('./routes/checkoutRoutes') },
        { path: '/api/orders', route: require('./routes/orderRoutes') },
        { path: '/api/upload', route: require('./routes/uploadRoutes') },
        { path: '/api/subscribe', route: require('./routes/subscribeRoute') },
        { path: '/api/admin', route: require('./routes/adminRoutes') },
        { path: '/api/admin/products', route: require('./routes/productAdminRoutes') },
        { path: '/api/admin/orders', route: require('./routes/adminOrderRoutes') },
        { path: '/api/product-reviews', route: require('./routes/productReviews') },
    ];
    
    // Use each route
    routes.forEach(({ path, route }) => {
        try {
            app.use(path, route);
            console.log(`✅ Route mounted: ${path}`);
        } catch (error) {
            console.error(`❌ Error mounting route ${path}:`, error.message);
        }
    });
    
    console.log('All routes loaded successfully!');
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start the application
connectDB();
