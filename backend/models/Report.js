const mongoose = require('mongoose');
const Counter = require('./Counter');

const reportSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    referenceNumber: {
        type: String,
        unique: true
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
    }
}, { timestamps: true });

reportSchema.pre('save', async function(next) {
    if (!this.referenceNumber) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'reportRef' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.referenceNumber = `REF-${counter.seq}`;
    }
    next();
});

module.exports = mongoose.model('Report', reportSchema);