const express = require('express');
const multer = require('multer');
const { sendBugReport } = require('../controllers/bugReportController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 5 // Max 5 files
    },
    fileFilter: (req, file, cb) => {
        // Accept images and PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only image and PDF files are allowed'), false);
        }
    }
});

// @route   POST /api/bug-report
// @desc    Submit a bug report
// @access  Public
router.post('/', 
    upload.array('attachments', 5), 
    async (req, res) => {
        try {
            // Add some validation if needed
            if (!req.body.email || !req.body.subject || !req.body.description) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email, subject, and description'
                });
            }
            
            // Call the controller
            await sendBugReport(req, res);
        } catch (error) {
            console.error('Error in bug report route:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

module.exports = router;
