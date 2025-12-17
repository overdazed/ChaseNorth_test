// import mongoose
const mongoose = require("mongoose");

// define subscriberSchema
const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);

// create a new file under the routes folder > subscribeRoute.js