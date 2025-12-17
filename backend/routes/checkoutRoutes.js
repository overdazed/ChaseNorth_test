// import express from "express";
const express = require('express');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


// 1. Route = Checkout Section
// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private/Customer, only customer can create a new checkout
router.post('/', protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // add a basic validation to check if there are any items in the checkout
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({message: 'No items in checkout.'});
    }

    try {
        // Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: 'Pending',
            isPaid: false
        });

        console.log(`Checkout created for user: ${req.user._id}`);

        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({message: 'Server Error'});
    }
})

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
router.post('/:id/finalize', protect, async (req, res) => {
    try {
        // retrieve the checkout by id from the URL
        const checkout = await Checkout.findById(req.params.id);
        // If the checkout session is not present, return 404
        if (!checkout) {
            return res.status(404).json({message: 'Checkout not found'});
        }
        // Check if checkout is paid, but not finalized
        if (checkout.isPaid && !checkout.isFinalized) {
            // if true, create the final order
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });
            // Mark the checkout as finalized to prevent duplicate orders
            checkout.isFinalized = true;
            checkout.finalized = Date.now();
            await checkout.save();

            // once the order is finalized, delete the users cart to clean up
            await Cart.findOneAndDelete({user: checkout.user});
            res.status(201).json(finalOrder);

            // If the checkout is already finalized, return 400
        } else if (checkout.isFinalized) {
            res.status(400).json({message: 'Checkout already finalized'});
        } else {
            // If the checkout is not paid, return 400
            res.status(400).json({message: 'Checkout is not paid'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
})

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