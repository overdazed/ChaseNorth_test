const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const invoiceService = require('../utils/invoiceService');

// @desc    Generate invoice for an order
// @route   POST /api/invoices/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
    try {
        const { orderId } = req.body;

        // Get order details with user information
        const order = await Order.findById(orderId)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the order belongs to the user or user is admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to access this order' });
        }

        // In invoiceRoutes.js, update the orderData preparation:
        const orderData = {
            items: order.orderItems.map(item => ({
                name: item.name,
                description: item.description || '',
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
            })),
            subtotal: order.price || order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            tax: order.tax || 0,
            shipping: order.shippingPrice || 0,
            total: order.totalPrice || (order.price + order.tax + (order.shippingPrice || 0)),
            orderDate: order.paidAt || order.createdAt,
            orderId: order._id,
            notes: 'Thank you for your order!',
            // Add shipping address to orderData
            shippingAddress: {
                firstName: order.shippingAddress.firstName || '',
                lastName: order.shippingAddress.lastName || '',
                address: order.shippingAddress.address,
                city: order.shippingAddress.city,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country
            }
        };

        // Company information
        const companyData = {
            name: process.env.COMPANY_NAME || 'Adventure Store',
            address: process.env.COMPANY_ADDRESS || '123 Adventure St',
            city: process.env.COMPANY_CITY || 'Adventure City',
            zip: process.env.COMPANY_ZIP || '12345',
            country: process.env.COMPANY_COUNTRY || 'Adventureland',
            email: process.env.COMPANY_EMAIL || 'billing@adventurestore.com',
            phone: process.env.COMPANY_PHONE || '+1 (555) 123-4567',
            website: process.env.COMPANY_WEBSITE || 'www.adventurestore.com',
            tax_rate: parseFloat(process.env.TAX_RATE) || 15.0
        };

        // Customer information
        const customerData = {
            name: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName || `${order.user.name}`,
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
            email: order.user.email
        };

        // Generate the invoice
        const { pdfBuffer, invoiceNumber } = await invoiceService.generateInvoice(
            orderData,
            companyData,
            customerData
        );

        // Update order with invoice number if not already set
        if (!order.invoiceNumber) {
            order.invoiceNumber = invoiceNumber;
            await order.save();
        }

        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceNumber}.pdf`);

        // Send the PDF file
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).json({
            message: 'Error generating invoice',
            error: error.message
        });
    }
});

// @desc    Get invoice by order ID
// @route   GET /api/invoices/order/:id
// @access  Private
router.get('/order/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the order belongs to the user or user is admin
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to access this order' });
        }

        // In a real app, you might want to store the generated invoice
        // and return it here, or regenerate it on the fly
        res.json({
            orderId: order._id,
            invoiceNumber: order.invoiceNumber,
            status: 'Invoice available for download',
            downloadUrl: `/api/invoices/download/${order._id}`
        });

    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({
            message: 'Error getting invoice',
            error: error.message
        });
    }
});

module.exports = router;
