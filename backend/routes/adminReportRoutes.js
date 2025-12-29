const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Report = require('../models/Report');

// @route   GET /api/admin/reports
// @desc    Get all reports with pagination
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;
        const status = req.query.status; // Optional status filter
        
        const query = {};
        if (status) {
            query.status = status;
        }
        
        const count = await Report.countDocuments(query);
        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('orderId', 'orderNumber')
            .lean();
            
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

// @route   GET /api/admin/reports/:id
// @desc    Get single report by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('orderId')
            .lean();
            
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/reports/:id
// @desc    Update report status and admin notes
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        // Update only the fields that are provided
        if (status) report.status = status;
        if (adminNotes !== undefined) report.adminNotes = adminNotes;
        
        const updatedReport = await report.save();
        
        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/reports/:id
// @desc    Delete a report
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        await report.remove();
        
        res.json({ message: 'Report removed' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
