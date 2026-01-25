import express from 'express';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';



const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    // Configure your email service here
    // Example for Gmail:
    service: 'gmail',
    auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASS
    }
});

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('subject').notEmpty().withMessage('Subject is required'),
        body('message').notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, subject, message, priority } = req.body;

        try {
            // Send email
            await transporter.sendMail({
                from: `"${name}" <${process.env.SUPPORT_EMAIL}>`,
                to: 'support@chasenorth.com',
                subject: `[${priority}] ${subject}`,
                text: `
                    You have received a new contact form submission:
                    
                    Name: ${name}
                    Email: ${email}
                    Priority: ${priority || 'Not specified'}
                    
                    Message:
                    ${message}
                `,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Priority:</strong> ${priority || 'Not specified'}</p>
                    <h3>Message:</h3>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            });

            res.status(200).json({ message: 'Your message has been sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending message. Please try again later.' });
        }
    }
);

export default router;
