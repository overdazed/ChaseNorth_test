// In your server.js or routes/newsletter.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const NewsletterSubscription = require('../models/NewsletterSubscription');
require('dotenv').config();

// Email transporter setup (using Gmail as an example)
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER, // e.g. newsletter@yourdomain.com
        pass: process.env.EMAIL_PASS  // mailbox password
    }
});

// Get a random discount code from environment variables
function getRandomDiscountCode() {
    const codes = [];
    for (let i = 1; i <= 9; i++) {
        if (process.env[`VITE_DISCOUNT_NL${i}`]) {
            codes.push(process.env[`VITE_DISCOUNT_NL${i}`]);
        }
    }
    return codes[Math.floor(Math.random() * codes.length)] || 'DISCOUNT10';
}

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if email already exists
        const existingSubscription = await NewsletterSubscription.findOne({ email: email.toLowerCase() });
        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        }
        const discountCode = getRandomDiscountCode();

        // Save to database first
        const subscription = new NewsletterSubscription({
            email: email.toLowerCase(),
            discountCode
        });
        await subscription.save();

        // Send email
        const mailOptions = {
            from: '"ChaseNorth" <compass@chasenorth.com>',
            to: email,
            subject: 'Your Exclusive Discount Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Thank you for subscribing to ChaseNorth!</h2>
                    <p>Here's your exclusive discount code: <strong>${discountCode}</strong></p>
                    <p>Use this code at checkout to get your discount.</p>
                    <p>Happy shopping!</p>
                    <p>— The ChaseNorth Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        // Here you would typically save the email and code to your database
        // await saveToDatabase(email, discountCode);

        res.json({
            success: true,
            message: 'Subscription successful'
        });

    } catch (error) {
        console.error('Error processing subscription:', error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to process subscription. Please try again.'
        });
    }
});

module.exports = router;