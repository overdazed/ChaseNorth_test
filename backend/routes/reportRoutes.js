const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const { sendReportConfirmation } = require('../services/emailService');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/reports
// @desc    Create a new report
// @access  Public
router.post('/', upload.array('attachments', 5), async (req, res) => {
    try {
        const { orderId, problemType, details, desiredOutcome, email } = req.body;
        const attachments = req.files || [];
        const uploadedFiles = [];

        // First create the report to get the reference number
        const report = new Report({
            orderId,
            problemType,
            details,
            desiredOutcome,
            email: email || (req.user ? req.user.email : null),
            userId: req.user?.id,
            attachments: []
        });

        await report.save();

        // Upload files to Supabase with reference number in filenames
        for (const [index, file] of attachments.entries()) {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${report.referenceNumber}${attachments.length > 1 ? `_${index}` : ''}.${fileExt.toLowerCase()}`;

            const { data, error } = await supabase.storage
                .from('reports')
                .upload(`attachments/${fileName}`, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('reports')
                .getPublicUrl(`attachments/${fileName}`);

            uploadedFiles.push({
                filename: file.originalname,
                path: `attachments/${fileName}`,
                url: publicUrl
            });
        }

        // Update report with attachments
        report.attachments = uploadedFiles;
        await report.save();

        // Rest of the code remains the same...
        const recipientEmail = email || (req.user ? req.user.email : null);
        if (recipientEmail) {
            try {
                await sendReportConfirmation({
                    to: recipientEmail,
                    referenceNumber: report.referenceNumber,
                    reportId: report._id,
                    orderId: report.orderId,
                    problemType: report.problemType,
                    details: report.details,
                    desiredOutcome: report.desiredOutcome,
                    attachments: uploadedFiles
                });
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.status(201).json({
            success: true,
            data: {
                ...report.toObject(),
                referenceNumber: report.referenceNumber
            },
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

// @route   GET /api/reports/order/:orderId
// @desc    Get report by order ID
// @access  Public
// router.get('/order/:orderId', async (req, res) => {
//     try {
//         const report = await Report.findOne({
//             orderId: req.params.orderId,
//             $or: [
//                 { userId: req.user.id },
//                 { email: req.user.email }
//             ]
//         });
//
//         // Return minimal public information
//         const publicReport = {
//             _id: report._id,
//             orderId: report.orderId,
//             status: report.status,
//             createdAt: report.createdAt,
//             updatedAt: report.updatedAt
//         };
//
//         if (!report) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No report found for this order'
//             });
//         }
//
//         res.json({
//             success: true,
//             data: report
//         });
//     } catch (error) {
//         console.error('Error fetching report:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching report',
//             error: error.message
//         });
//     }
// });
router.get('/order/:orderId', async (req, res) => {
    try {
        const report = await Report.findOne({ orderId: req.params.orderId })
            .select('_id orderId status createdAt updatedAt')
            .lean();

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'No report found for this order'
            });
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching report',
            error: error.message
        });
    }
});

module.exports = router;