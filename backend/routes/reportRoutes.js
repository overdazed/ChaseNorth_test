const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
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
                url: publicUrl,
                mimetype: file.mimetype
            });
        }

        // Update report with attachments
        report.attachments = uploadedFiles;
        await report.save();

        // Send confirmation email
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

// @route   GET /api/reports/user/:email
// @desc    Get reports by user email
// @access  Public
router.get('/user/:email', async (req, res) => {
    try {
        const reports = await Report.find({ email: req.params.email })
            .populate('orderId', 'orderNumber')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            reports: reports || []
        });
    } catch (error) {
        console.error('Error fetching user reports:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user reports',
            error: error.message
        });
    }
});

// Admin routes
const adminRouter = express.Router();

// Apply admin middleware to all admin routes
adminRouter.use(protect, admin);

// @desc    Get all reports with pagination and search
// @route   GET /api/admin/reports
// @access  Private/Admin
adminRouter.get('/', async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        // Search and filter
        const keyword = req.query.keyword
            ? {
                $or: [
                    { referenceNumber: { $regex: req.query.keyword, $options: 'i' } },
                    { problemType: { $regex: req.query.keyword, $options: 'i' } },
                    { email: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const count = await Report.countDocuments({ ...keyword });
        const reports = await Report.find({ ...keyword })
            .populate('orderId', 'orderNumber')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            reports,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update report status
// @route   PATCH /api/admin/reports/:id/status
// @access  Private/Admin
adminRouter.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Submitted', 'In Review', 'Needs Info', 'Resolved', 'Rejected', 'Archived'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        const updatedReport = await report.save();

        res.json({
            _id: updatedReport._id,
            referenceNumber: updatedReport.referenceNumber,
            status: updatedReport.status,
            updatedAt: updatedReport.updatedAt
        });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get single report
// @route   GET /api/admin/reports/:id
// @access  Private/Admin
adminRouter.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('orderId')
            .populate('attachments');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mount admin routes
router.use('/admin/reports', adminRouter);

module.exports = router;