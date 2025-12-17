const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

// Basic route
app.get('/', (req, res) => {
    res.send('Minimal server is working!');
});

// Test product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Test product reviews route
const productReviewsRoutes = require('./routes/productReviews');
app.use('/api/product-reviews', productReviewsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 9000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Test the products route at: http://localhost:9000/api/products');
    });
});
