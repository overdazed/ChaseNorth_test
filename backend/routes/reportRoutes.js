const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const { sendReportConfirmation } = require('../services/emailService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/reports
// @desc    Create a new report
// @access  Public
router.post('/', upload.array('attachments', 5), async (req, res) => {
    try {
        const { orderId, problemType, details, desiredOutcome, email } = req.body;
        const attachments = req.files || [];

        // Create and save report
        const report = new Report({
            orderId,
            problemType,
            details,
            desiredOutcome,
            email: email || req.user.email,
            userId: req.user.id,
            attachments: attachments.map(file => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype
            }))
        });

        await report.save();

        // Send confirmation email if email is provided
        const recipientEmail = email || (req.user ? req.user.email : null);
        if (recipientEmail) {
            try {
                await sendReportConfirmation({
                    to: recipientEmail,
                    referenceNumber: report.referenceNumber,  // Make sure this is included
                    reportId: report._id,
                    orderId: report.orderId,
                    problemType: report.problemType,
                    details: report.details,
                    desiredOutcome: report.desiredOutcome
                });
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.status(201).json({
            success: true,
            data: report,
            message: 'Report submitted successfully'
        });

    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting report',
            error: error.message
        });
    }
});

module.exports = router;