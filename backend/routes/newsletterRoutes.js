// In your server.js or routes/newsletter.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
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
router.post('/api/newsletter/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const discountCode = getRandomDiscountCode();

        // Send email
        const mailOptions = {
            from: '"Chase North" <compass@chasenorth.com>',
            to: email,
            subject: 'Your Exclusive Discount Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Thank you for subscribing to Chase North!</h2>
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

        res.json({ success: true, message: 'Subscription successful' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to process subscription' });
    }
});

module.exports = router;