const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    problemType: {
        type: String,
        required: true
    },
    details: String,
    desiredOutcome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        path: String,
        mimetype: String
    }],
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    referenceNumber: {
        type: String,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);