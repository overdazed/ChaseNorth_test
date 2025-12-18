// import express from "express";
const express = require('express');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const { generateAndSaveInvoice } = require('../utils/invoiceStorage');
const router = express.Router();


// 1. Route = Checkout Section
// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private/Customer, only customer can create a new checkout
// In the POST / route of checkoutRoutes.js
router.post('/', protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Add validation for required fields
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({message: 'No items in checkout.'});
    }

    try {
        // Ensure shipping address has required fields
        // const shippingAddress = {
        //     ...checkout.shippingAddress,
        //     firstName: checkout.shippingAddress?.firstName || 'Customer',
        //     lastName: checkout.shippingAddress?.lastName || 'Name'
        // };
        const completeShippingAddress = {
            ...shippingAddress,  // from destructured req.body
            firstName: shippingAddress?.firstName || 'Customer',
            lastName: shippingAddress?.lastName || 'Name'
        };

        // Create a new checkout session with the complete shipping address
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress: completeShippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: 'Pending',
            isPaid: false
        });

        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

// Add Pay Route
// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark after successful payment
// @access Private
router.put('/:id/pay', protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        // We need to find the checkout by id passed in the URL parameter
        const checkout = await Checkout.findById(req.params.id);
        // If the checkout does not exist, return 404
        if (!checkout) {
            return res.status(404).json({message: 'Checkout not found'});
        }
        // Check if paymentStatus is "Paid"
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            // Update paymentStatus to "Paid"
            checkout.paymentStatus = paymentStatus;
            // Store the additional payment details like transaction ID or payment method
            checkout.paymentDetails = paymentDetails;
            // record the time when the payment was made
            checkout.paidAt = Date.now();
            // safe the updated checkout account to the database
            await checkout.save();
            // respond with 200 and update the checkout object
            res.status(200).json(checkout);
        } else {
            // If paymentStatus is not "Paid", return 400
            res.status(400).json({message: 'Invalid Payment Status.'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
})

// Finalized Route
// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
// In checkoutRoutes.js, update the POST /:id/finalize route
router.post('/:id/finalize', protect, async (req, res) => {
    try {
        // Retrieve the checkout by id from the URL
        const checkout = await Checkout.findById(req.params.id);

        // If the checkout session is not present, return 404
        if (!checkout) {
            return res.status(404).json({message: 'Checkout not found'});
        }

        // Ensure shipping address has required fields
        const shippingAddress = {
            ...checkout.shippingAddress,
            firstName: checkout.shippingAddress?.firstName || 'Customer',
            lastName: checkout.shippingAddress?.lastName || 'Name'
        };

        // Check if checkout is paid, but not finalized
        if (checkout.isPaid && !checkout.isFinalized) {
            // Create the final order with the updated shipping address
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,        // Make sure these are included
                    color: item.color       // Make sure these are included
                })),
                shippingAddress: shippingAddress,  // Use the updated shipping address
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                // tax: tax,
                // shippingPrice: shippingPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                paymentResult: {
                    id: checkout.paymentDetails?.id || 'N/A',
                    status: checkout.paymentStatus,
                    update_time: checkout.paidAt,
                    email_address: req.user.email
                }
            });

            // Generate and save invoice
            try {
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

                const customerData = {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() || req.user.name,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                    email: req.user.email
                };

                const orderData = {
                    orderId: finalOrder._id.toString(),
                    items: finalOrder.orderItems.map(item => ({
                        name: item.name,
                        description: item.description || '',
                        quantity: item.quantity,
                        price: item.price,
                        total: item.quantity * item.price,
                        size: item.size,
                        color: item.color
                    })),
                    subtotal: finalOrder.totalPrice,
                    tax: 0, // Update with actual tax if available
                    shipping: 0, // Update with actual shipping if available
                    total: finalOrder.totalPrice,
                    orderDate: finalOrder.paidAt || finalOrder.createdAt,
                    notes: 'Thank you for your order!',
                    shippingAddress: shippingAddress
                };

                const { invoiceNumber, invoicePath } = await generateAndSaveInvoice(
                    orderData,
                    companyData,
                    customerData
                );

                // Update order with invoice information
                finalOrder.invoiceNumber = invoiceNumber;
                finalOrder.invoicePath = invoicePath;
                await finalOrder.save();

                console.log(`Invoice generated and saved: ${invoicePath}`);
            } catch (invoiceError) {
                console.error('Error generating invoice:', invoiceError);
                // Don't fail the order if invoice generation fails
            }

            // Mark the checkout as finalized
            checkout.isFinalized = true;
            await checkout.save();
            // blaaaaa
            // Clear the user's cart
            await Cart.findOneAndDelete({ user: req.user._id });

            // Update product counts in stock
            for (const item of checkout.checkoutItems) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { countInStock: -item.quantity } }
                );
            }

            res.status(201).json(finalOrder);
        } else {
            res.status(400).json({
                message: checkout.isFinalized ?
                    'Order already finalized' :
                    'Payment not completed'
            });
        }
    } catch (error) {
        console.error('Error finalizing order:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router

// include this file in server.js

// Test the route with Postman
// Add a new collection "Checkout" > name it "Create" > POST > URL:http://localhost:9000/api/checkout > Body > raw
// Add Authorization > Bearer > Token copy from Login request
// Send > 200 > Payment Status is not paid
// {
//     "checkoutItems": [
//     {
//         "productId": "684cb51e3f2947ea741f7edc",
//         "name": "Classic Oxford Button-Down Shirt",
//         "image": "http://picsum.photos/seed/denim1/500/500",
//         "price": 20,
//         "quantity": 1
//     }
// ],
//     "shippingAddress": {
//     "address": "123 street",
//         "city": "New York",
//         "postalCode": "10001",
//         "country": "USA"
// },
//     "paymentMethod": "PayPal",
//     "totalPrice": 20
// }

// Test Finalize Request, creates an order on successful payment
// New request > Finalize > POST > URL:http://localhost:9000/api/checkout/:id/finalize > Body > raw > nothing
// Add Authorization > Bearer > Token copy from Login request
// Send > 201 > We are able to finalize the checkout session