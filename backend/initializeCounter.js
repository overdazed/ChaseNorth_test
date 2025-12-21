const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

async function initializeCounter() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Initialize or update the counter
        const counter = await Counter.findOneAndUpdate(
            { _id: 'reportRef' },
            { $setOnInsert: { seq: 1 } },
            { upsert: true, new: true }
        );

        console.log('Counter initialized/updated:', counter);
        process.exit(0);
    } catch (error) {
        console.error('Error initializing counter:', error);
        process.exit(1);
    }
}

initializeCounter();