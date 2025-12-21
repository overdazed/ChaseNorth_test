const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const { sendReportConfirmation } = require('../services/emailService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper function to generate a reference number
const generateReferenceNumber = () => {
    return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
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

        // Generate a reference number
        const referenceNumber = generateReferenceNumber();
        
        // Save the report with reference number
        report.referenceNumber = referenceNumber;
        await report.save();
        
        try {
            // Send confirmation email
            await sendReportConfirmation(email, referenceNumber);
            console.log(`Confirmation email sent to ${email} for report ${referenceNumber}`);
            
            res.status(201).json({ 
                success: true,
                message: 'Report submitted successfully',
                referenceNumber
            });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Still return success since the report was saved, but log the email error
            res.status(201).json({ 
                success: true,
                message: 'Report submitted, but there was an issue sending the confirmation email',
                referenceNumber
            });
        }
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
router.get('/order/:orderId', protect, async (req, res) => {
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