// Import mongoose
const mongoose = require('mongoose');

// Define the InvoiceCounter schema
const invoiceCounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: 'invoiceCounter'
    },
    counter: {
        type: Number,
        required: true,
        default: 1
    },
    last_date: {
        type: String,
        required: true,
        default: ''
    }
});

// Create and export the InvoiceCounter model
const InvoiceCounter = mongoose.model('InvoiceCounter', invoiceCounterSchema);

module.exports = InvoiceCounter;