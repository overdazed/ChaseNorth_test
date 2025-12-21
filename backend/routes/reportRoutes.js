const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Report = require('../models/Report');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
    try {
        const { orderId, problemType, details, desiredOutcome, email } = req.body;
        const attachments = req.files || [];

        // Save report to database
        const report = new Report({
            orderId,
            problemType,
            details,
            desiredOutcome,
            email,
            attachments: attachments.map(file => ({
                filename: file.originalname,
                path: file.path,
                mimetype: file.mimetype
            }))
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({
            message: 'Error submitting report',
            error: process.env.NODE_ENV === 'production' ? 'Server error' : error.message
        });
    }
});

// @route   GET /api/reports/order/:orderId
// @desc    Get reports for an order
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
    try {
        const reports = await Report.find({
            orderId: req.params.orderId,
            $or: [
                { email: req.user.email },
                { 'order.user': req.user.id }
            ]
        }).sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            message: 'Error fetching reports',
            error: process.env.NODE_ENV === 'production' ? 'Server error' : error.message
        });
    }
});

module.exports = router;